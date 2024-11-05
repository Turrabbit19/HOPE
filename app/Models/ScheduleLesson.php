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
        'study_date'
    ];
}
