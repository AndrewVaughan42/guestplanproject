<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('venue_menu_item_wedding', function (Blueprint $table) {
            $table->foreignId('venue_menu_item_id');
            $table->foreignId('wedding_id')->constrained()->cascadeOnDelete();

            $table->primary(['venue_menu_item_id', 'wedding_id']);
            $table->unique(['venue_menu_item_id', 'wedding_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('venue_menu_item_wedding');
    }
};
