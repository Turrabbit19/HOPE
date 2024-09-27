<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanSemester extends Model
{
    use HasFactory;

    protected $fillable = ['plan_id', 'semester_id', 'order'];

    public function subjects()
    {
        return $this->belongsToMany(Subject::class);
    }
}
