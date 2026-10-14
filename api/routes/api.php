<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CustomerController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\OwnerReportController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\ServiceTypeController;
use App\Http\Middleware\EnsureUserIsOwner;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/service-types', [ServiceTypeController::class, 'index']);

    Route::apiResource('customers', CustomerController::class)->only(['index', 'store', 'show', 'update']);

    Route::apiResource('orders', OrderController::class)->only(['index', 'store', 'show', 'update']);
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);

    // Payments (accessible by authenticated staff and owner)
    Route::get('/orders/{order}/payments', [PaymentController::class, 'index']);
    Route::post('/orders/{order}/payments', [PaymentController::class, 'store']);

    // Staff operational dashboard
    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);

    // Owner exclusive business reports & dashboard
    Route::prefix('owner')->middleware(EnsureUserIsOwner::class)->group(function () {
        Route::get('/dashboard', [OwnerReportController::class, 'dashboard']);
        Route::get('/reports', [OwnerReportController::class, 'reports']);
        Route::post('/seed-demo', [OwnerReportController::class, 'seedDemo']);
        Route::post('/reset-demo', [OwnerReportController::class, 'resetDemo']);
    });
});
