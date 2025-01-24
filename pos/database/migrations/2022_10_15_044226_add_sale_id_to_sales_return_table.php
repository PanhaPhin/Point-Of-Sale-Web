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
        Schema::table('sales_return', function (Blueprint $table) {
            $table->unsignedBigInteger('sale_id')->nullable()->after('date');
            $table->foreign('sale_id')
                ->references('id')->on('sales')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales_return', function (Blueprint $table) {
            $table->dropColumn('sale_id');
        });
    }
};
