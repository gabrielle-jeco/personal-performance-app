<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class TaskController extends Controller
{
    /**
     * Get tasks for a specific supervisor.
     * Route: GET /api/supervisor/{id}/tasks
     */
    public function index(Request $request, $supervisorId)
    {
        $user = Auth::user();

        // Security check (if Manager, allow if in same location or RM. If Supervisor, allow only self)
        // For simplicity now, assuming Manager context

        $query = Task::where('user_id', $supervisorId);

        if ($request->has('date')) {
            $query->whereDate('due_at', $request->date);
        }

        $tasks = $query->orderBy('due_at', 'asc')->get();

        return response()->json($tasks);
    }

    /**
     * Create a new task.
     * Route: POST /api/tasks
     */
    public function store(Request $request)
    {
        $request->validate([
            'supervisor_id' => 'required|exists:users,user_id',
            'title' => 'required|string',
            'due_at' => 'required|date',
            'note' => 'nullable|string'
        ]);

        $task = Task::create([
            'user_id' => $request->supervisor_id,
            'manager_id' => Auth::id(),
            'title' => $request->title,
            'note' => $request->note,
            'due_at' => $request->due_at,
            'status' => 'pending'
        ]);

        return response()->json($task, 201);
    }

    /**
     * Delete a task.
     */
    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        // Authorization check?
        $task->delete();
        return response()->json(['message' => 'Task deleted']);
    }

    /**
     * Update task status (Approve/Reject).
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected,pending'
        ]);

        $task = Task::findOrFail($id);
        $task->status = $request->status;
        $task->save();

        return response()->json($task);
    }

    /**
     * Remove proof image from a task.
     */
    public function removeProof($id)
    {
        $task = Task::findOrFail($id);

        // In a real app, delete the file from storage here (Storage::delete($task->proof_image))

        $task->proof_image = null;
        // Optionally reset status if proof is removed?
        // $task->status = 'pending'; 
        $task->save();

        return response()->json(['message' => 'Proof removed', 'task' => $task]);
    }
    /**
     * Upload evidence (Before/After photos) for a task.
     * Route: POST /api/tasks/{id}/evidence
     */
    public function uploadEvidence(Request $request, $id)
    {
        $request->validate([
            'before' => 'nullable|image|max:10240', // Max 10MB
            'after' => 'nullable|image|max:10240',
        ]);

        $task = Task::findOrFail($id);

        // Security check: Ensure the authenticated user is the one assigned to the task
        if ($task->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($request->hasFile('before')) {
            $path = $request->file('before')->store('tasks', 'public');
            $task->before_image = $path;
        }

        if ($request->hasFile('after')) {
            $path = $request->file('after')->store('tasks', 'public');
            $task->after_image = $path;
        }

        // If both images are present (or logically "work is done"), update status
        if ($task->before_image && $task->after_image) {
            $task->status = 'submitted';
        }

        $task->save();

        return response()->json($task);
    }
    /**
     * Remove evidence image (before/after) from a task.
     * Route: DELETE /api/tasks/{id}/evidence
     */
    public function removeEvidence(Request $request, $id)
    {
        $request->validate([
            'type' => 'required|in:before,after'
        ]);

        $task = Task::findOrFail($id);
        $type = $request->input('type');

        // Security check
        if ($task->user_id !== Auth::id()) {
            // return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($type === 'before') {
            $task->before_image = null;
        } elseif ($type === 'after') {
            $task->after_image = null;
        }

        $task->save();

        return response()->json(['message' => 'Evidence removed', 'task' => $task]);
    }
}
