<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subject extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'description',
        'credit',
        'order',
        'max_students',
        'form',
        'status'
    ];

    protected $casts = [
        'form' => 'boolean',
        'status' => 'boolean'
    ];

    public function majors()
    {
        return $this->belongsToMany(Major::class, 'major_subjects');
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
}
