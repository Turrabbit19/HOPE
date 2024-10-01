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
    ];
    
    public function majors()
    {
        return $this->belongsToMany(Major::class, 'major_subjects')
                    ->withPivot('semester_order');
    }
}