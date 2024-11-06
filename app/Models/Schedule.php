<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Schedule extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'course_id',
        'semester_id',
        'major_id',
        'subject_id',
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

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }
    public function major()
    {
        return $this->belongsTo(Major::class);
    }
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function days()
    {
        return $this->belongsToMany(Day::class, 'study_days')
                    ->select('days.id'); 
    }

    public function lessons()
    {
        return $this->belongsToMany(Lesson::class, 'schedule_lessons')
                    ->withPivot('study_date');
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
    public function courseSemester()
{
    return $this->belongsTo(CourseSemester::class);
}

}
