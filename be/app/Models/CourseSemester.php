<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CourseSemester extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'semester_id',
        'order',
    ];

    public function course() {
        return $this->belongsTo(Course::class);
    }
    public function semester() {
        return $this->belongsTo(Semester::class);
    }
}
