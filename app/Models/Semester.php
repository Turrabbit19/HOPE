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
        'number',
        'course_id',
        'start_date',
        'end_date',
    ];

    public function course() {
        return $this->belongsTo(Course::class);
    }
    public function plans() {
        return $this->belongsToMany(Plan::class);
    }
}