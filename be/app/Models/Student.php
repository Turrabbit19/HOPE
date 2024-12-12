<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'course_id',
        'current_semester',
        'student_code',
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function majors()
    {
        return $this->belongsToMany(Major::class, 'student_majors');
    }

    public function classrooms()
    {
        return $this->belongsToMany(Classroom::class);
    }

    public function schedules()
    {
        return $this->belongsToMany(Schedule::class, 'student_schedules');
    }
}
