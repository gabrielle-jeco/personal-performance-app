<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login', [App\Http\Controllers\AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [App\Http\Controllers\AuthController::class, 'me']);
    Route::post('/logout', [App\Http\Controllers\AuthController::class, 'logout']);

    // Manager Routes
    Route::get('/manager/supervisors', [App\Http\Controllers\ManagerController::class, 'getSupervisors']);

    // Task Routes
    Route::get('/supervisor/{id}/tasks', [App\Http\Controllers\TaskController::class, 'index']);
    Route::get('/crews/{id}/tasks', [App\Http\Controllers\TaskController::class, 'index']);
    Route::post('/tasks', [App\Http\Controllers\TaskController::class, 'store']);
    Route::delete('/tasks/{id}', [App\Http\Controllers\TaskController::class, 'destroy']);
    Route::patch('/tasks/{id}/status', [App\Http\Controllers\TaskController::class, 'updateStatus']);
    Route::delete('/tasks/{id}/proof', [App\Http\Controllers\TaskController::class, 'removeProof']);

    // Evaluation Routes
    Route::post('/evaluations', [App\Http\Controllers\EvaluationController::class, 'store']);
    Route::get('/evaluations/check/{supervisorId}', [App\Http\Controllers\EvaluationController::class, 'checkPeriod']);
    // Evaluation Routes
    Route::post('/evaluations', [App\Http\Controllers\EvaluationController::class, 'store']);
    Route::get('/evaluations/check/{supervisorId}', [App\Http\Controllers\EvaluationController::class, 'checkPeriod']);
});

// Supervisor Routes
Route::middleware(['auth:sanctum'])->prefix('supervisor')->group(function () {
    Route::get('/crews', [App\Http\Controllers\SupervisorController::class, 'index']);
    Route::get('/stats', [App\Http\Controllers\SupervisorController::class, 'myStats']);
});

// Temporary Dev Route
Route::get('/test/create-rm', function () {
    $user = \App\Models\User::updateOrCreate(
        ['username' => 'rm_demo'],
        [
            'full_name' => 'Regional Manager Demo',
            'password' => bcrypt('password'),
            'role_type' => 'manager',
            'manager_type' => 'RM',
            'location_id' => null, // RM oversees all
            'active' => true
        ]
    );
    return response()->json(['message' => 'RM Created', 'user' => $user]);
});

Route::get('/test/create-supervisor', function () {
    // 1. Clean Up Old Data
    \App\Models\User::where('username', 'supervisor_andi')->delete();
    \App\Models\User::where('email', 'like', 'crew_%@yogyagroup.com')->delete();

    // 2. Create Location
    $location = \App\Models\Location::firstOrCreate(
        ['name' => 'Fashion Bandung'],
        ['is_locked' => true, 'address' => 'Bandung City']
    );

    // 3. Create Supervisor
    $user = \App\Models\User::create([
        'username' => 'supervisor_andi',
        'full_name' => 'Andi Supervisor',
        'email' => 'andi@yogyagroup.com',
        'password' => bcrypt('password'),
        'role_type' => 'supervisor',
        'manager_type' => null,
        'location_id' => $location->location_id,
        'active' => true
    ]);

    // 4. Create Crews
    $crews = ['Crew Alpha', 'Crew Beta', 'Crew Charlie'];
    foreach ($crews as $name) {
        \App\Models\User::create([
            'username' => strtolower(str_replace(' ', '_', $name)),
            'full_name' => $name,
            'email' => strtolower(str_replace(' ', '_', $name)) . '@yogyagroup.com',
            'password' => bcrypt('password'),
            'role_type' => 'employee', // Fixed: Enum is 'employee'
            'location_id' => $location->location_id,
            'active' => true
        ]);
    }

    return response()->json(['message' => 'Supervisor & Crews Created (Clean Slate)', 'user' => $user]);
});
