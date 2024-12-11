import { userAppStore } from '@/Store'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ContactsContainer from './components/contacts-container';
import EmptyChatConatiner from './components/empty-chat-container';
import ChatContainer from './components/chat-container';

function Chat() {

  const {userinfo,
    selectedChatType,
    isUploding,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,} = userAppStore();
  const navigate = useNavigate();

  useEffect(()=>{
    if(!userinfo.profileSetup){
         toast("Please Setup Profile to Continue");
         navigate("/profile")
    }
  },[userinfo,navigate])
    return (
    <div className='flex h-[100vh] text-white overflow-hidden'>
      {
        isUploding && <div className='h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 items-center justify-center flex-col gap-5 backdrop-blur-lg'>
          <h5 className='text-5xl animate-pulse'>Uploading Files</h5>
          {fileUploadProgress}%
        </div>
      }
      {
        isDownloading && <div className='h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 items-center justify-center flex-col gap-5 backdrop-blur-lg'>
          <h5 className='text-5xl animate-pulse'>Downloading Files</h5>
          {fileDownloadProgress}%
        </div>
      }
      <ContactsContainer/>
      {
        selectedChatType===undefined ? <EmptyChatConatiner/>:<ChatContainer/>
      }
      {/* <EmptyChatConatiner/> */}
      {/* <ChatContainer/> */}
    </div>
  )
}

export default Chat
