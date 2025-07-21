import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { userInfo, selectedChatData, selectedChatType, addMessage } =
    useAppStore();

  useEffect(() => {
    if (!userInfo) return;

    const newSocket = io(HOST, {
      withCredentials: true,
      query: { userId: userInfo.id },
      autoConnect: true, // Ensure auto-connect is enabled
    });

    // Set up all event listeners before setting the socket
    newSocket.on("connect", () => {
      console.log("Connected to socket server with ID:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });

    const handleRecieveMessage = (message) => {
      console.log("Message received:", message);
      if (
        selectedChatType &&
        selectedChatData &&
        (selectedChatData._id === message.sender._id ||
          selectedChatData._id === message.recipient._id)
      ) {
        addMessage(message);
      }
    };

    newSocket.on("receiveMessage", handleRecieveMessage); // Fixed typo in event name

    setSocket(newSocket);

    return () => {
      newSocket.off("receiveMessage", handleRecieveMessage);
      newSocket.disconnect();
    };
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
