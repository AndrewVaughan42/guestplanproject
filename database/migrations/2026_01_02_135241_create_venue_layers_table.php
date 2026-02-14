<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('venue_layers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('venue_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id');
            $table->integer('tableAmount');
            $table->jsonb('tableLayout');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('venue_layers');
    }
};
