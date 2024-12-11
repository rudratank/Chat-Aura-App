import { useSocket } from '@/context/SocketContext';
import { userAppStore } from '@/Store';
import { UPLOADS_FILES_ROUTES } from '@/utils/constants';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import {useEffect, useRef, useState} from 'react';
import {GrAttachment} from "react-icons/gr"
import { IoSend } from 'react-icons/io5';
import { RiEmojiStickerLine } from 'react-icons/ri';

function MessageBar() {
    const emojiRef=useRef();
    const fileInputRef=useRef();
    const socket =useSocket();
    const {selectedChatType,selectedChatData,userinfo,setIsUploding,setFileUploadProgress} = userAppStore();
    const [message, setmessage] = useState("");
    const [emojiPickerOpen, setemojiPickerOpen] = useState(false);

    useEffect(()=>{
        function handleClickOutside(event){
            if(emojiRef.current && !emojiRef.current.contains(event.target)){
                setemojiPickerOpen(false);
            }
        }
        document.addEventListener('mousedown',handleClickOutside)
        return () =>{
            document.removeEventListener("mousedown",handleClickOutside)
        };

    },[emojiRef]);

    const handleAddEmoji=(emoji)=>{
        setmessage((msg)=>msg+emoji.emoji)
    }

    const handleSendMesaage=async()=>{
        if(selectedChatType === "contact"){
                socket.emit("sendMessage",{ 
                    sender:userinfo.id,
                    content:message,
                    recipient:selectedChatData._id,
                    messageType:"text",
                    fileUrl:undefined,
                })
        }
        else if(selectedChatType==="channel")
        {
            socket.emit("send-channel-message",{
                sender:userinfo.id,
                    content:message,
                    messageType:"text",
                    fileUrl:undefined,
                    channelId:selectedChatData._id,
            })
        }

        setmessage("")
    }


    const handleAttachmentClick=()=>{
        if(fileInputRef.current){
            fileInputRef.current.click();
        }
    };

    const handleAttachmentChange=async(event)=>{
        try {
            const file = event.target.files[0];
            if(file){
                const formData=new FormData();
                formData.append("file",file);
                setIsUploding(true);
                const response=await axios.post(UPLOADS_FILES_ROUTES,formData,{withCredentials:true,onUploadProgress:data=> {
                    setFileUploadProgress(Math.round((100*data.loaded)/data.total))
                }});

                if(response.status===200 && response.data){
                    setIsUploding(false);
                    if(selectedChatType==='contact'){

                    
                    socket.emit("sendMessage",{
                        sender:userinfo.id,
                        content:undefined,
                        recipient:selectedChatData._id,
                        messageType:"file",
                        fileUrl:response.data.filePath,
                    });
                }
                else if(selectedChatType==="channel"){
                    socket.emit("send-channel-message",{
                        sender:userinfo.id,
                            content:undefined,
                            messageType:"file",
                            fileUrl:response.data.filePath,
                            channelId:selectedChatData._id,
                    })
                }
            }
        }
            console.log({file});
            
        } catch (error) {
            setIsUploding(false)
            console.log(error);
            
        }
    }


  return (
    <div className="h-[10vh] bg=[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
        <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5 ">
            <input type="text" 
            placeholder="Message" 
            className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none" 
            value={message}
            onChange={e=>setmessage(e.target.value)}
            />
             <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
              onClick={handleAttachmentClick}
             >
                <GrAttachment  className='text-2xl '/>
            </button>
            <input type="file" className='hidden' ref={fileInputRef} onChange={handleAttachmentChange} />
            <div className="relative">
            <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
            onClick={()=>setemojiPickerOpen(true)}
            >
                <RiEmojiStickerLine  className='text-2xl '/>
            </button>
            <div className="absolute bottom-16 right-0" ref={emojiRef}>
                <EmojiPicker theme='dark'
                open={emojiPickerOpen} onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
                />
            </div>
            </div>
        </div>
        <button className='bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#714bda] focus:bg-[#714bda] focus:outline-none focus:text-white duration-300 transition-all'
        onClick={handleSendMesaage}
        >
                <IoSend className='text-2xl '/>
            </button>
    </div>
  )
}

export default MessageBar
