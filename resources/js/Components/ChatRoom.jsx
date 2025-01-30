import React, { useState, useEffect } from "react";
import axios from "axios";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

const ChatRoom = ({ roomId, user }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Fetch existing messages when component mounts
        axios.get(`/api/chat-rooms/${roomId}/messages`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            setMessages(response.data);
        })
        .catch(error => console.error("Error fetching messages:", error));

        // Setup Pusher
        window.Pusher = Pusher;
        window.Echo = new Echo({
            broadcaster: 'pusher',
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            wsHost: import.meta.env.VITE_PUSHER_HOST || '127.0.0.1',
            wsPort: import.meta.env.VITE_PUSHER_PORT || 6001,
            forceTLS: import.meta.env.VITE_PUSHER_SCHEME === 'https',
            disableStats: true,
        });

        // Listen for new messages
        window.Echo.channel(`chat-room.${roomId}`)
            .listen("MessageSent", (event) => {
                setMessages((prevMessages) => [...prevMessages, event.message]);
            });

        return () => {
            window.Echo.leave(`chat-room.${roomId}`);
        };
    }, [roomId]);

    // Send message function
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            await axios.post(`/api/chat-rooms/${roomId}/messages`, { message }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setMessage(""); // Clear the message input after sending
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="chat-room">
            <h2>Chat Room {roomId}</h2>
            <div className="messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.user_id === user.id ? "own" : ""}`}>
                        <strong>{msg.user?.name || "Unknown"}:</strong> {msg.message}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default ChatRoom;
