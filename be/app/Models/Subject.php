<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subject extends Model
{
    use HasFactory, SoftDeletes;

    protected $dates = ['deleted_at'];
    public function major()
    {
        return $this->belongsTo(Major::class, 'major_id');
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }
    protected $fillable = [
        'subject_code',
        'semester_id',
        'major_id',
        'name',
        'description',
        'credit',
    ];

}
