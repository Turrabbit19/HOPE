<?php

use App\Models\Plan;
use App\Models\Semester;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plan_semesters', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Plan::class)->constrained()->onDelete('cascade'); 
            $table->foreignIdFor(Semester::class)->constrained()->onDelete('cascade'); 
            $table->integer('order'); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plan_semesters');
    }
};
