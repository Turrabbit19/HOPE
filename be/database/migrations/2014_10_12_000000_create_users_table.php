<?php

use App\Models\Role;
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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->text('avatar')->nullable();
            $table->string('name'); 
            $table->string('email')->unique(); 
            $table->string('phone')->unique();
            $table->date('dob');
            $table->boolean('gender');
            $table->string('ethnicity');
            $table->string('address');
            $table->timestamp('email_verified_at')->nullable();
            $table->text('password');
            $table->foreignIdFor(Role::class)->constrained()->onDelete('cascade');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};