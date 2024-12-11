import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "../../../../../../components/ui/tooltip";
  import { FaPlus } from "react-icons/fa";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import { useEffect, useState } from "react";
  import { animationDefaultOption, getColor } from "@/lib/utils";
  import Lottie from "react-lottie";
  import axios from "axios";
  import { CREATE_CHANNELS_ROUTES, GET_ALL_CONTACT_ROUTES, GET_USER_CHANNELS_ROUTES } from "@/utils/constants";
  import { userAppStore } from "@/Store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/multipleselect";
import { toast } from "sonner";
  
  function CreateChannels() {
    const { setSelectedChatType, setSelectedChatData,addChannel,setChannels } = userAppStore();
    const [newChannelModal, setnewChannelModal] = useState(false);
    const [searchError, setSearchError] = useState(false);
    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts, setselectedContacts] = useState([]);
    const [channelName, setchannelName] = useState("")

    useEffect(()=>{
        const getData=async()=>{
            const response=await axios.get(GET_ALL_CONTACT_ROUTES,{withCredentials:true});
            setAllContacts(response.data.contacts)
        }

        getData();
    },[])
  

    const createChannel = async () => {
      try {
        // Validate inputs with more detailed checks
        if (!channelName.trim()) {
          toast.error("Channel name cannot be empty");
          return;
        }
    
        if (selectedContacts.length === 0) {
          toast.error("Please select at least one contact");
          return;
        }
    
        const response = await axios.post(CREATE_CHANNELS_ROUTES, {
          name: channelName,
          member: selectedContacts.map((contact) => contact.value)
        }, { withCredentials: true });
    
        if (response.status === 201) {
          // Fetch updated channels list instead of just adding the new channel
          const updatedChannelsResponse = await axios.get(GET_USER_CHANNELS_ROUTES, { withCredentials: true });
          
          if (updatedChannelsResponse.data.channels) {
            setChannels(updatedChannelsResponse.data.channels);
            
            // Optionally, select the newly created channel
            const newChannel = updatedChannelsResponse.data.channels[0];
            setSelectedChatType("channel");
            setSelectedChatData(newChannel);
          }
    
          // Reset form
          setchannelName(""); 
          setselectedContacts([]);
          setnewChannelModal(false);
    
          // Optional: Show success toast
          toast.success("Channel created successfully");
        }
      } catch (error) {
        console.error("Error creating channel:", error);
        
        // Handle specific error scenarios
        if (error.response) {
          switch (error.response.status) {
            case 400:
              toast.error("Invalid channel details");
              break;
            case 409:
              toast.error("A channel with this name already exists");
              break;
            default:
              toast.error("Failed to create channel");
          }
        } else {
          toast.error("Network error. Please check your connection.");
        }
      }
    };
  
    // Render fallback UI
    const renderFallback = () => (
      <div className="flex flex-col items-center justify-center flex-1 text-center">
        <Lottie
          isClickToPauseDisabled
          height={150}
          width={150}
          options={animationDefaultOption}
        />
        <h3 className="mt-4 text-white text-opacity-80 text-lg">
          Start by searching for a <span className="text-purple-500">Contact</span>!
        </h3>
      </div>
    );
  
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FaPlus
                className="text-neutral-400 hover:text-white transition duration-300 cursor-pointer text-lg"
                onClick={() => setnewChannelModal(true)}
                aria-label="Create New Channel"
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] text-white p-2">
              Create New Channels
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
  
        <Dialog
          open={newChannelModal}
          onOpenChange={() => setnewChannelModal(!newChannelModal)}
        >
          <DialogContent className="bg-[#181920] text-white w-full max-w-md p-6 rounded-lg">
            <DialogHeader>
              <DialogTitle>Please Fillup the Details for new channel</DialogTitle>
              <DialogDescription>Search and select a contact to chat with.</DialogDescription>
            </DialogHeader>
  
            <Input
              placeholder="Channel Name"
              className="rounded-lg mt-4 p-3 bg-[#2c2e3b] border-none"
              onChange={(e) => setchannelName(e.target.value)}
              value={channelName}
            />  
            <div>
                <MultipleSelector className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white" 
                defaultOptions={allContacts}
                placeholder="Search Contacts"
                value={selectedContacts}
                onChange={setselectedContacts}
                emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600">No Results Found</p>
                }
                />
            </div>
            <Button className="w-full bg-purple-700 hover:bg-purple-900 duration-300 transition-all" onClick={createChannel}>
                Create Channel
            </Button>

          </DialogContent>
        </Dialog>
      </>
    );
  }
  
  export default CreateChannels;
  