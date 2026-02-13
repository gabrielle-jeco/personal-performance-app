<?php

use App\Models\User;
use App\Models\Task;
use Illuminate\Support\Facades\DB;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== SERVER INFO ===\n";
echo "PHP Timezone: " . date_default_timezone_get() . "\n";
echo "App Config Timezone: " . config('app.timezone') . "\n";
echo "Current Date (PHP): " . date('Y-m-d H:i:s') . "\n";
echo "Current Date (Now): " . now()->format('Y-m-d H:i:s') . "\n";

echo "\n=== TABLE COLUMNS: USERS ===\n";
$columns = \Illuminate\Support\Facades\Schema::getColumnListing('users');
print_r($columns);

echo "\n=== DATABASE USERS (RAW) ===\n";
$users = DB::table('users')->get();
foreach ($users as $user) {
    echo json_encode($user) . "\n";
}

echo "\n=== LATEST 5 TASKS ===\n";
$tasks = Task::latest()->take(5)->get();
foreach ($tasks as $task) {
    echo "Task ID: {$task->task_id} | User ID (Assigned): {$task->user_id} | Manager ID: {$task->manager_id} | Title: {$task->title} | Due: {$task->due_at} (Raw: " . $task->getRawOriginal('due_at') . ")\n";
}

echo "\n=== CHECK SPECIFIC DATES ===\n";
// Check count for today
$today = date('Y-m-d');
$count = Task::whereDate('due_at', $today)->count();
echo "Tasks Due Date $today (PHP Date): $count\n";

$todayJakarta = \Carbon\Carbon::now('Asia/Jakarta')->format('Y-m-d');
$countJakarta = Task::whereDate('due_at', $todayJakarta)->count();
echo "Tasks Due Date $todayJakarta (Jakarta Date): $countJakarta\n";
