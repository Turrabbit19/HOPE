<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduleLesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'schedule_id',
        'lesson_id',
        'study_date',
        'teacher_id'
    ];

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}
