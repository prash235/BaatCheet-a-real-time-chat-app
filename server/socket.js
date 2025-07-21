import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModel.js";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const sendMessage = async (message, callback) => {
    try {
      const senderSocketId = userSocketMap.get(message.sender);
      const recipientSocketId = userSocketMap.get(message.recipient);

      console.log(
        "Sending message from:",
        message.sender,
        "to:",
        message.recipient
      );
      console.log(
        "Sender socket:",
        senderSocketId,
        "Recipient socket:",
        recipientSocketId
      );

      const createdMessage = await Message.create(message);
      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email firstName lastName image color")
        .populate("recipient", "id email firstName lastName image color");

      // Send acknowledgment back to sender
      if (callback) {
        callback({ status: "success", message: messageData });
      }

      // Send to recipient if online
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessage", messageData);
      }

      // Also send back to sender (for their own UI)
      if (senderSocketId) {
        io.to(senderSocketId).emit("receiveMessage", messageData);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      if (callback) {
        callback({ error: err.message });
      }
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    }

    socket.on("sendMessage", async (message, callback) => {
      console.log("Received sendMessage event with data:", message);
      try {
        await sendMessage(message, callback);
      } catch (err) {
        console.error("Error handling sendMessage:", err);
        if (callback) {
          callback({ error: err.message });
        }
      }
    });

    socket.on("disconnect", () => {
      handleDisconnect(socket);
    });
  });

  const handleDisconnect = (socket) => {
    console.log(`client disconnected ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`user connected ${userId} with ${socket.id}`);
    } else {
      console.log("user id not provided in socket handshake.");
    }

    // 🔥 Listen for sendMessage
    socket.on("sendMessage", async (message) => {
      try {
        console.log("sendmessage try catch");
        await sendMessage(message);
      } catch (err) {
        console.error("Error sending message:", err);
      }
    });

    // 🔌 Proper disconnect handler
    socket.on("disconnect", () => handleDisconnect(socket));
  });
};

export default setupSocket;
