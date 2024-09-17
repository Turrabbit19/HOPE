<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lessons extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'subject_id',
        'name',
        'description'
    ];

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}
