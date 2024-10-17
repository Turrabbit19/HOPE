<?php

use App\Http\Controllers\Api\Admin\ApiUserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::prefix('/')->group( function () {
    Route::get('/', function () {
        return view('client.index');
    });
    Route::get('notifications', function () {
        return view('client.notification');
    });
    Route::get('schedules', function () {
        return view('client.schedule');
    });
    Route::get('student-details', function () {
        return view('client.student-detail');
    });
    Route::get('add-schedules', function () {
        return view('client.add-schedule');
    });

});