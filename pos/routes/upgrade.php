<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

Route::get('/upgrade-to-v1-2-0', function () {
    Artisan::call('migrate',
        [
            '--force' => true,
        ]);
});

// upgrade all database

Route::get('/upgrade/database', function () {
    if (config('app.upgrade_mode')) {
        Artisan::call('migrate', ['--force' => true]);
    }
});
