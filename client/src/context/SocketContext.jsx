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
    });

    const handleReceiveMessage = (message) => {
      // Only add message if it's not from the current user
      if (message.sender._id !== userInfo.id) {
        console.log("Message received from other user:", message);
        addMessage(message);
      }
      // For sent messages, we update the optimistic message via the ack callback
    };

    newSocket.on("receiveMessage", handleReceiveMessage);

    setSocket(newSocket);

    return () => {
      newSocket.off("receiveMessage", handleReceiveMessage);
      newSocket.disconnect();
    };
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
