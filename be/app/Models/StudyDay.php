<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudyDay extends Model
{
    use HasFactory;

    protected $fillable = [
        'schedule_id',
        'day_id',
    ];

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }

    public function day()
    {
        return $this->belongsTo(Day::class);
    }

}
