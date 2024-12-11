import { userAppStore } from "@/Store";
import { GET_ALL_MESSAGES_ROUTES, GET_CHANNEL_MESSAGES, HOST } from "@/utils/constants";
import axios from "axios";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";

function MessageContainer() {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userinfo,
    selectedChatMessages,
    setSelectedChatMessages,
    setFileDownloadProgress,
    setIsDownloading,
  } = userAppStore();
  const [showImage, setshowImage] = useState(false);
  const [imageURL, setimageURL] = useState(null);
  const imageurl2="https://chat-aura-app-backend.onrender.com"

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await axios.post(
          GET_ALL_MESSAGES_ROUTES,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const getChannelMessages=async()=>{
      try {
        const response = await axios.get(
          `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
      else if(selectedChatType === "channel") getChannelMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const downloadFile = async (url) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);

    const response = await axios.get(`https://chat-aura-app-backend.onrender.com/${url}`, {
      responseType: "blob",onDownloadProgress:(ProgressEvent)=>{
        const {loaded,total}=ProgressEvent;
        const percentCompleted=Math.round((loaded*100)/total);
        setFileDownloadProgress(percentCompleted);
      },
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgress(0);
  };

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-green-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType==="channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      )}
      {message.messageType === "file" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {checkIfImage(message.fileUrl) ? (
            <img
              src={`https://chat-aura-app-backend.onrender.com/${message.fileUrl}`}
              height={300}
              width={300}
              alt="Message file"
              className="cursor-pointer"
              onClick={() => {
                setshowImage(true);
                setimageURL(message.fileUrl);
              }}
            />
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => downloadFile(message.fileUrl)}
              >
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );


  const renderChannelMessages = (message) => {
    return (
      <div className={`mt-5 ${message.sender._id !== userinfo.id ? "text-left" : "text-right"}`}>
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender._id === userinfo.id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9`}
          >
            {message.content}
          </div>
        )}
        {
          message.sender._id !==userinfo.id?<div className="flex items-center justify-start gap-3">
            <Avatar className="w-8 h-8 ring-2 ring-white/10">
            {message.sender.image && (
              <AvatarImage
                src={`${imageurl2}/${message.sender.image}`}
                alt={`${selectedChatData.firstName || ""}'s avatar`}
              />
            )}
              <AvatarFallback
                className={`flex items-center justify-center w-full h-full text-lg font-bold ${getColor(
                  message.sender.color
                )}`}
              >
                {message.sender.firstName? message.sender.firstName?.[0] :message.sender.email?.[0]}
              </AvatarFallback>
          </Avatar>
          <span className="text-sm text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
          <span className="text-xs text-white/60">{
            moment(message.timestamp).format("LT")
          }</span>

          </div> : <div className="text-xs text-white/60 mt-1">{
            moment(message.timestamp).format("LT")
          }</div>
        }
        
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender._id === userinfo.id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <img
                src={`https://chat-aura-app-backend.onrender.com/${message.fileUrl}`}
                height={300}
                width={300}
                alt="Message file"
                className="cursor-pointer"
                onClick={() => {
                  setshowImage(true);
                  setimageURL(message.fileUrl);
                }}
              />
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        
        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`https://chat-aura-app-backend.onrender.com/${imageURL}`}
              className="h-[80vh] w-full bg-cover"
              alt="Enlarged"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(imageURL)}
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setshowImage(false);
                setimageURL(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageContainer;
