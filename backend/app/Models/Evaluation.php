<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'manager_id',
        'date',
        'scores',
        'total_score',
        'notes',
    ];

    protected $casts = [
        'scores' => 'array',
        'date' => 'date',
    ];
}
