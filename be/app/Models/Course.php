<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    public function semesters()
    {
        return $this->hasMany(Semester::class);
    }

    protected $fillable = [
        'name',
        'start_date',
        'end_date'
    ];

}
