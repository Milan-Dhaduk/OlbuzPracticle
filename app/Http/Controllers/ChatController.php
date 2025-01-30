<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Events\MessageSent;
use App\Models\ChatRoom;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function getChatRooms()
    {
        return response()->json(ChatRoom::all());
    }
    public function getMessages($roomId)
    {
        return response()->json(
            Message::where('chat_room_id', $roomId)->with('user')->get()
        );
    }
    public function sendMessage(Request $request, $roomId)
    {
        $request->validate([
            'message' => 'required|string|max:1000'
        ]);

        $message = Message::create([
            'chat_room_id' => $roomId,
            'user_id' => Auth::id(),
            'message' => $request->message
        ]);

        // Broadcast the message event
        broadcast(new MessageSent($message))->toOthers();

        return response()->json($message);
    }
    public function createChatRoom(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $chatRoom = ChatRoom::create([
            'name' => $request->name,
        ]);

        return response()->json($chatRoom, 201);
    }
}
