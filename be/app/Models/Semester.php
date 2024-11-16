<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Semester extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'status',
    ];

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_semesters')
                    ->withPivot('order');
    }
    public function orders()
    {
        return $this->hasMany(CourseSemester::class);

    }
}
