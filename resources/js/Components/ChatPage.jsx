import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatRoom from "../Components/ChatRoom";
import CreateChatRoom from "../Components/CreateChatRoom";

const ChatPage = ({ auth }) => { 
    const [chatRooms, setChatRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState(null);

    useEffect(() => {
        axios.get("/api/chat-rooms", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then((response) => {
            setChatRooms(response.data);
        })
        .catch((error) => console.error("Error fetching chat rooms:", error));
    }, []);

    const handleRoomSelect = (roomId) => {
        setSelectedRoomId(roomId);
    };

    const handleRoomCreate = (newRoom) => {
        setChatRooms((prevRooms) => [...prevRooms, newRoom]);
    };

    return (
        <div>
            <h1>Chat App</h1>
            <CreateChatRoom onCreate={handleRoomCreate} />
            <ul>
                {chatRooms.map((room) => (
                    <li key={room.id} onClick={() => handleRoomSelect(room.id)}>
                        {room.name}
                    </li>
                ))}
            </ul>
            {selectedRoomId && <ChatRoom roomId={selectedRoomId} user={auth.user} />}
        </div>
    );
};

export default ChatPage;
