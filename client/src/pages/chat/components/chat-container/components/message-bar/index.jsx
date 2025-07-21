import { useSocket } from "@/context/SocketContext";
import { useAppStore } from "@/store";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";

const MessageBar = () => {
  const emojiRef = useRef();
  const socket = useSocket();
  const { selectedChatData, selectedChatType, addMessage, userInfo } =
    useAppStore();

  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const isSending = useRef(false); // Add this line to declare isSending ref

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChatData || !socket) return;

    // Prevent multiple rapid clicks
    if (isSending.current) return;
    isSending.current = true;

    try {
      console.log("Sending message with socket ID:", socket.id);

      const messageData = {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      };

      // Optimistic UI update
      addMessage({
        ...messageData,
        _id: Date.now(), // Temporary ID
        createdAt: new Date(),
        sender: { _id: userInfo.id },
        status: 'sending'
      });

      socket.emit("sendMessage", messageData, (ack) => {
        isSending.current = false;
        
        if (ack?.error) {
          console.error("Server error:", ack.error);
          // Update message status to failed in your store
        } else {
          console.log("Message sent successfully");
          setMessage("");
        }
      });
    } catch (err) {
      isSending.current = false;
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Type Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
          <GrAttachment className="text-2xl " />
        </button>
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setEmojiPickerOpen(true)}
          >
            <RiEmojiStickerLine className="text-2xl " />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        onClick={handleSendMessage}
        disabled={!message.trim() || isSending.current}
        className={`bg-[#8417ff] rounded-md flex items-center justify-center p-5 ${
          !message.trim() || isSending.current ? 'opacity-50' : 'hover:bg-[#741bda]'
        } focus:border-none focus:outline-none duration-300 transition-all`}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;