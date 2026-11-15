
<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route CRUD Produk
Route::apiResource('products', ProductController::class)->only(['index', 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

// Route Register
Route::post('/register', [AuthController::class, 'register']);

// Route Login
Route::post('/login', [AuthController::class, 'login']);

// Route yang membutuhkan autentikasi
Route::middleware('auth:sanctum')->group(function () {

    // Mengambil data user yang sedang login
    Route::get('/user', function (Request $request) {
        return response()->json([
            'message' => 'Data user berhasil diambil',
            'user' => $request->user(),
        ]);
    });

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Crud khusus admin //

    Route::middleware('admin')->group(function () {
        Route::apiResource('products', ProductController::class)
            ->only(['store', 'update', 'destroy']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::patch('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    });
});
