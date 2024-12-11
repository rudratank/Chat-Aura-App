import { userAppStore } from "@/Store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { HOST } from "@/utils/constants";

function ContactList({ contacts, isChannel = false }) {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
  } = userAppStore();

  const handleClick = (contact) => {
    setSelectedChatType(isChannel ? "channel" : "contact");
    setSelectedChatData(contact);

    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]); // Clear messages for new contact/channel
    }
  };

  const renderName = (contact) =>
    isChannel ? contact.name : `${contact.firstName || ""} ${contact.lastName || ""}`;
const imageurl="http://localhost:8747"
  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          onClick={() => handleClick(contact)}
          className={`pl-2 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData?._id === contact._id
              ? "bg-[#8417ff] hover:bg-[#8417ff]"
              : "hover:bg-[#f1f1f111]"
          }`}
          aria-label={`Select ${renderName(contact)}`}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel ? (
              <Avatar className="w-10 h-10 ring-2 ring-white/10">
                {contact.image ? (
                  <AvatarImage
                    src={`${imageurl}/${contact.image}`}
                    alt={`${renderName(contact)}'s avatar`}
                    onError={(e) => (e.target.style.display = "none")} // Fallback handling
                  />
                ) : (
                  <div
                    className={`
                        ${selectedChatData && selectedChatData._id === contact._id ? "bg-[#ffff22] border border-white/70" : "getColor(contact.color)}"}
                        flex items-center justify-center w-full h-full text-lg font-bold`}
                  >
                    {contact.firstName?.[0] || contact.email?.[0] || "?"}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className="bg-[#ffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
            <span>{renderName(contact)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ContactList;
