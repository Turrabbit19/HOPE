<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Schedule extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'course_semester_id',
        'major_subject_id',
        'classroom_id',
        'teacher_id',
        'shift_id',
        'room_id',
        'link',
        'start_date',
        'end_date',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    public function courseSemester()
    {
        return $this->belongsTo(CourseSemester::class);
    }

    public function majorSubject()
    {
        return $this->belongsTo(MajorSubject::class);
    }

    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}