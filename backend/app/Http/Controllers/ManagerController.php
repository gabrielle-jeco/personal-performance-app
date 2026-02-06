<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ManagerController extends Controller
{
    /**
     * Get list of supervisors for the logged-in manager.
     */
    public function getSupervisors(Request $request)
    {
        $user = Auth::user();

        // Security Check: Must be a manager
        if ($user->role_type !== 'manager') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = User::where('role_type', 'supervisor')->where('active', true);
        $locations = [];
        $filterLocationName = 'All Locations';

        // LOGIC: Filter by Location
        if ($user->manager_type === 'SM') {
            // Store Manager: Strictly locked to their location
            $query->where('location_id', $user->location_id);
            $locations = $user->location ? [['id' => $user->location->location_id, 'name' => $user->location->name]] : [];
            $filterLocationName = $user->location ? $user->location->name : 'Unknown';
        } else {
            // Regional Manager: Can see all, or filter by specific
            $locations = \App\Models\Location::select('location_id as id', 'name')->get();

            if ($request->has('location_id') && $request->location_id) {
                // frontend sends "id" (which is location_id)
                $query->where('location_id', $request->location_id);
                // In $locations collection, we selected 'location_id as id', so we search by 'id'
                $loc = $locations->firstWhere('id', $request->location_id);
                $filterLocationName = $loc ? $loc->name : 'Unknown Location';
            }
        }

        $supervisors = $query->with('location')->get()->map(function ($spv) {
            // Randomize data for demo purposes to match the "Traffic Light" requirement
            $score = rand(60, 98);

            return [
                'id' => $spv->user_id,
                'name' => $spv->full_name,
                'role' => 'Supervisor', // In future, maybe distinguish 'Fresh', 'Fashion' etc.
                'location' => $spv->location ? $spv->location->name : 'N/A',
                'status' => $spv->active ? 'active' : 'inactive',
                'score' => $score,
                'activity_percentage' => $score, // Mapping score to activity % for now
                'task_progress' => rand(50, 100), // Different metric for the thin progress bar
                'is_top_performer' => $score > 95 // Logic for the Star icon
            ];
        });

        // Calculate Average for the Location (or filtered set)
        $avgScore = $supervisors->avg('score');

        return response()->json([
            'manager' => [
                'name' => $user->full_name,
                'role' => $user->role_type === 'manager' ? ($user->manager_type === 'SM' ? 'Store Manager' : 'Regional Manager') : 'Manager',
                'type' => $user->manager_type // identifying RM vs SM on frontend
            ],
            'location_name' => $filterLocationName,
            'locations' => $locations, // List for dropdown
            'location_avg_progress' => round($supervisors->avg('task_progress'), 1),
            'supervisors' => $supervisors
        ]);
    }
}
