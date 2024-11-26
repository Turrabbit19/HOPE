<?php

use App\Models\Major;

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
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name')->unique();
            $table->text('description');
            $table->integer('credit');
            $table->tinyInteger('order');
            $table->boolean('status')->default(TRUE); // 'Đang hoạt động', 'Tạm dừng'
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subjects');
    }
};