<?php

use App\Models\Notification;
use App\Models\Student;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('student_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Student::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Notification::class)->constrained()->cascadeOnDelete();
            $table->boolean('status')->default(False);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_notifications');
    }
};
