import { useAppStore } from "@/store"

const Profile=()=>{
  const {userInfo}=useAppStore()
  return <div>
    <div>Email:{userInfo.id}</div>
  </div>
}

export default Profile
