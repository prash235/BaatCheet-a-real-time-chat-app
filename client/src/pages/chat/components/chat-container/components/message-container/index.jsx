import { useAppStore } from "@/store";
import moment from "moment";
import React, { useEffect, useRef } from "react";

const MessageContainer = () => {
  const scrollRef = useRef();
  const messagesEndRef = useRef();
  const {
    selectedChatData,
    selectedChatType,
    selectedChatMessages,
    userInfo,
  } = useAppStore();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChatMessages]);

  // Group messages by date
  const renderMessages = () => {
    if (!selectedChatMessages || selectedChatMessages.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          No messages yet. Start the conversation!
        </div>
      );
    }

    let lastDate = null;
    return selectedChatMessages.map((message) => {
      const messageDate = moment(message.createdAt).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={message._id || message.timestamp} className="mb-4">
          {showDate && (
            <div className="text-center text-gray-500 text-sm my-4">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {renderMessageBubble(message)}
        </div>
      );
    });
  };

  // Render individual message bubble
  const renderMessageBubble = (message) => {
    const isCurrentUser = message.sender?._id === userInfo?.id;
    const isTextMessage = message.messageType === "text";

    return (
      <div
        className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-2`}
      >
        <div
          className={`max-w-[75%] lg:max-w-[60%] rounded-lg p-3 ${
            isCurrentUser
              ? "bg-[#8417ff] text-white"
              : "bg-[#2a2b33] text-gray-200"
          }`}
        >
          {isTextMessage ? (
            <p className="break-words">{message.content}</p>
          ) : (
            <div className="flex flex-col">
              {/* For future file/image messages */}
              <span className="text-sm italic">[File attachment]</span>
              <a 
                href={message.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-300 hover:underline"
              >
                View file
              </a>
            </div>
          )}
          <div
            className={`text-xs mt-1 ${
              isCurrentUser ? "text-white/80" : "text-gray-400"
            }`}
          >
            {moment(message.createdAt).format("h:mm A")}
            {isCurrentUser && (
              <span className="ml-1">
                {message.status === "sent" ? "✓" : "✓✓"}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 px-6 scrollbar-thin scrollbar-thumb-[#2a2b33] scrollbar-track-transparent">
      {renderMessages()}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageContainer;