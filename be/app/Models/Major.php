<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Major extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'description',
        'status',
        'major_id'
    ];
    protected $casts = [
        'status' => 'boolean',
    ];

    public function parent()
    {
        return $this->belongsTo(Major::class, 'major_id');
    }

    public function children()
    {
        return $this->hasMany(Major::class, 'major_id');
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'major_subjects');
    }
    public function students()
    {
        return $this->belongsToMany(Student::class, 'student_majors');
    }
}
