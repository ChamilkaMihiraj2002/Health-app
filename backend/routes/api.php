<?php

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\DoctorsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;


Route::post("/login", [AuthController::class,"login"]);
Route::post("/register", [AuthController::class,"register"]);
Route::post("/update", [AuthController::class,"update"]);
Route::get('/users', [AuthController::class, 'showAllUsers']);
Route::delete('/users/{id}', [AuthController::class, 'deleteUser']);


Route::middleware(['auth:sanctum'])->group(function () {
    Route::post("/logout", [AuthController::class,"logout"]);
    Route::get("/profile", [AuthController::class,"profile"]);
    Route::post("/update", [AuthController::class,"update"]);
    Route::get('/users', [AuthController::class, 'showAllUsers']);
    Route::delete('/users/{id}', [AuthController::class, 'deleteUser']);

    Route::apiResource('appointments', AppointmentController::class);
    Route::get('/appointments/user/{userID}', [AppointmentController::class, 'getAppointmentsByUserID']);
});

Route::apiResource('doctors', DoctorsController::class);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
