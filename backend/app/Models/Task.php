<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $primaryKey = 'task_id';

    protected $fillable = [
        'user_id',
        'manager_id',
        'title',
        'note',
        'due_at',
        'status',
        'proof_image',
        'before_image',
        'after_image'
    ];

    protected $casts = [
        'due_at' => 'datetime',
    ];

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'manager_id', 'user_id');
    }
}
