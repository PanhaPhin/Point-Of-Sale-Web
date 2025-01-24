<?php

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
        Schema::create('pos_register', function (Blueprint $table) {
            $table->id();
            $table->double('cash_in_hand');
            $table->datetime('closed_at')->nullable();
            $table->double('cash_in_hand_while_closing')->nullable();
            $table->double('bank_transfer')->nullable();
            $table->double('cheque')->nullable();
            $table->double('other')->nullable();
            $table->double('total_sale')->nullable();
            $table->double('total_return')->nullable();
            $table->double('total_amount')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
