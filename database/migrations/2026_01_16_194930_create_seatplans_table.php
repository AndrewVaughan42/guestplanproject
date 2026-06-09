<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('seatplans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wedding_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('venue_layer_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->jsonb('layout');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seatplans');
    }
};
