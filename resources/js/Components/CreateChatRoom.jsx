import React, { useState } from "react";
import axios from "axios";

const CreateChatRoom = ({ onCreate }) => {
    const [roomName, setRoomName] = useState("");
    const [errors, setErrors] = useState(null);  // Store validation errors

    // Handle form submission
    const handleCreate = async (e) => {
        e.preventDefault();

        // Client-side validation (e.g., ensure room name is not empty)
        if (!roomName.trim()) {
            setErrors({ name: "Room name is required" });
            return;
        }

        // Reset errors before making the request
        setErrors(null);

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found. User might not be logged in.");
            return;
        }

        try {
            const response = await axios.post(
                '/api/chat-rooms',
                { name: roomName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            console.log(response.data);
            onCreate(response.data);
            setRoomName("");
        } catch (error) {
            if (error.response) {
                if (error.response.status === 422) {
                    setErrors(error.response.data.errors);  
                } else {
                    console.error("Error creating chat room:", error.response.data);
                }
            } else {
                console.error("Error creating chat room:", error.message);
            }
        }
    };

    return (
        <form onSubmit={handleCreate}>
            <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name"
            />
            {errors?.name && <div className="error">{errors.name}</div>} {/* Show validation error message */}

            <button type="submit">Create Room</button>
        </form>
    );
};

export default CreateChatRoom;
