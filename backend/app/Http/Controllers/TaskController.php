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
}
