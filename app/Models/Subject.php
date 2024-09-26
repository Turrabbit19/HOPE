<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subject extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'subject_code',
        'semester_id',
        'major_id',
        'name',
        'description',
        'credit',
    ];

    public function semester() {
        return $this->belongsTo(Semester::class);
    }
    
    public function majors() {
        return $this->belongsToMany(Major::class);
    }
}