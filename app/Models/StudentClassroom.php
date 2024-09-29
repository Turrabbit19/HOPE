<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentClassroom extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_id',
        'classroom_id',
        'schedule_id',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    public function student() {
        return $this->belongsTo(Student::class);
    }
    public function classroom() {
        return $this->belongsTo(Classroom::class);
    }
    public function schedule() {
        return $this->belongsTo(Schedule::class);
    }
}
