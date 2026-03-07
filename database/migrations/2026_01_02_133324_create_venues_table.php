<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('venues', static function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('minimum_table_amount');
            $table->integer('maximum_table_amount');
            $table->integer('minimum_capacity');
            $table->integer('maximum_capacity');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('venues');
    }
};
