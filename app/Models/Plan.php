<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Plan extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'course_id',
        'semester_id',
        'subject_id',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
    public function semesters()
    {
        return $this->belongsToMany(Semester::class);
    }
}