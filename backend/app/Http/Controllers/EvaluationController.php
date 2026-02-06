<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EvaluationController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'required|exists:users,user_id',
                'scores' => 'required|array',
                'total_score' => 'required|numeric',
                'date' => 'required|date',
                'notes' => 'nullable|string'
            ]);

            $evaluation = Evaluation::updateOrCreate(
                [
                    'user_id' => $request->user_id,
                    'date' => $request->date,
                ],
                [
                    'manager_id' => Auth::id(),
                    'scores' => $request->scores,
                    'total_score' => $request->total_score,
                    'notes' => $request->notes
                ]
            );

            return response()->json($evaluation);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Evaluation Store Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function checkPeriod(Request $request, $supervisorId)
    {
        $dateStr = $request->query('date', now()->format('Y-m-d'));
        $date = \Carbon\Carbon::parse($dateStr);

        $evaluation = Evaluation::where('user_id', $supervisorId)
            ->whereYear('date', $date->year)
            ->whereMonth('date', $date->month)
            ->first();

        // Safe response
        return response()->json([
            'evaluated' => !!$evaluation,
            'data' => $evaluation
        ]);
    }
}
