<?php

use App\Http\Controllers\Api\V1\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'President Tailor API',
        'status' => 'operational',
    ]);
});

Route::post('/login', [AuthController::class, 'login'])->middleware('web')->name('login');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('web');
Route::post('/api/v1/login', [AuthController::class, 'login'])->middleware('web');
Route::post('/api/v1/logout', [AuthController::class, 'logout'])->middleware('web');
