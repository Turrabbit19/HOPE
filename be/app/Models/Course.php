<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'start_date',
        'end_date'
    ];

    public function students()
    {
        return $this->hasMany(Student::class);
    }


    public function semesters()
    {
        return $this->belongsToMany(Semester::class, 'course_semesters')
                    ->withPivot('order')
                    ->withTimestamps();
    }
}

