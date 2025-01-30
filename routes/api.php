<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/chat-rooms', [ChatController::class, 'getChatRooms']);
    Route::post('/chat-rooms', [ChatController::class, 'createChatRoom']);
    Route::get('/chat-rooms/{room}/messages', [ChatController::class, 'getMessages']);
    Route::post('/chat-rooms/{room}/messages', [ChatController::class, 'sendMessage']);
});


