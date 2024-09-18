<?php

use App\Models\Semester;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('classrooms', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Semester::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(Subject::class)->constrained()->onDelete('cascade');
            $table->string('code')->unique(); // mã lớp
            $table->foreignIdFor(Teacher::class)->constrained()->onDelete('cascade');
            $table->integer('max_students');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classrooms');
    }
};