<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('guests', static function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('wedding_id')->references('id')->on('weddings')->cascadeOnDelete();
            $table->string('meal_choice')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};
