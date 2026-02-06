<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade'); // Supervisor
            $table->foreignId('manager_id')->constrained('users', 'user_id')->onDelete('cascade'); // Manager
            $table->date('date');
            $table->json('scores'); // Stores details like {"attitude": 5, "cooperation": 4}
            $table->double('total_score'); // Cached total/average
            $table->text('notes')->nullable();
            $table->timestamps();

            // Ensure one evaluation per supervisor per day
            $table->unique(['user_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('evaluations');
    }
};
