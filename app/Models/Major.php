<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Major extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'majors'; 

    protected $fillable = [
        'code',
        'name',
        'description',
        'status',
    ];
    protected $casts = [
        'status' => 'boolean',
    ];

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'major_subjects');
    }

    public function planSubjects()
{
    return $this->hasMany(PlanSubject::class);
}
}