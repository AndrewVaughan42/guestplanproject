<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('guest_conflicts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guest_a_id')->constrained('guests')->cascadeOnDelete();
            $table->foreignId('guest_b_id')->constrained('guests')->cascadeOnDelete();
            $table->foreignId('wedding_id')->constrained()->cascadeOnDelete();

            $table->unique(['guest_a_id', 'guest_b_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guest_conflicts');
    }
};
