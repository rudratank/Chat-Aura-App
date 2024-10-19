import { useState } from "react";
import victory from "@/assets/victory.svg"; // Ensure the path is correct
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import apiClient from "@/lib/api-client";
import { SIGNUP_ROUTE,LOGIN_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
  
    const data = {
      email: email.trim(),
      password: password,
    };
  
    setLoading(true);
  
    try {
      const response = await axios.post(LOGIN_ROUTE, data, {
        withCredentials: true,
      });
      console.log('Login Success:', response.data);
      toast.success("Login successful!");
      if (response.data.user.id) {
        if (response.data.user.profileSetup) {
          navigate("/chat");
        } else {
          navigate("/profile");
        }
      }
    } catch (error) {
      console.error('Login Error:', error.response ? error.response.data : error.message);
      toast.error(error.response ? error.response.data : "Login failed!");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignup = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
  
    const data = {
      email: email.trim(),
      password: password, 
    };
  
    console.log('Signup Data:', data);
  
    setLoading(true);
  
    try {
      const response = await axios.post(SIGNUP_ROUTE, data, {
        withCredentials: true, 
      });
      console.log('Signup Success:', response.data);
      toast.success("Signup successful!");

      if (response.status === 201) {
        navigate("/profile");
      }
    } catch (error) {
      console.error('Signup Error:', error.response ? error.response.data : error.message);
      toast.error(error.response ? error.response.data : "Signup failed!");
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-800">
      <div className="relative bg-white shadow-2xl rounded-3xl h-4/5 w-[90vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] flex xl:grid xl:grid-cols-2 overflow-hidden">
        <div className="hidden xl:flex flex-col items-center justify-center bg-gray-700 text-white rounded-l-3xl p-10">
          <img src={victory} alt="victory emoji" className="h-20 mb-6 animate-bounce" />
          <h1 className="text-5xl font-extrabold mb-4">Welcome</h1>
          <p className="text-lg font-medium text-center">
            Start chatting with friends instantly on the best chat app!
          </p>
        </div>
        <div className="flex flex-col items-center justify-center p-10 w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" defaultValue="login">
            <TabsList className="mb-6 flex justify-center space-x-4">
              <TabsTrigger
                value="login"
                className="text-xl font-semibold border-b-4 border-transparent text-gray-400 transition-all duration-300 hover:text-black hover:border-blue-500 data-[state=active]:text-black data-[state=active]:border-blue-500 p-2"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="text-xl font-semibold border-b-4 border-transparent text-gray-400 transition-all duration-300 hover:text-black hover:border-blue-500 data-[state=active]:text-black data-[state=active]:border-blue-500 p-2"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="flex flex-col gap-6">
              <Input
                placeholder="Email"
                type="email"
                className="rounded-full p-4 text-lg bg-[#F5F7FA] text-gray-800 placeholder-gray-400 border-2 border-gray-300 shadow-sm focus:outline-none focus:border-blue-400 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                className="rounded-full p-4 text-lg bg-[#F5F7FA] text-gray-800 placeholder-gray-400 border-2 border-gray-300 shadow-sm focus:outline-none focus:border-blue-400 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                className="rounded-full py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all duration-300 w-full"
                onClick={handleLogin}
              >
                Login
              </Button>
            </TabsContent>
            <TabsContent value="signup" className="flex flex-col gap-6">
              <Input
                placeholder="Email"
                type="email"
                className="rounded-full p-4 text-lg bg-[#F5F7FA] text-gray-800 placeholder-gray-400 border-2 border-gray-300 shadow-sm focus:outline-none focus:border-blue-400 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                className="rounded-full p-4 text-lg bg-[#F5F7FA] text-gray-800 placeholder-gray-400 border-2 border-gray-300 shadow-sm focus:outline-none focus:border-blue-400 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                placeholder="Confirm Password"
                type="password"
                className="rounded-full p-4 text-lg bg-[#F5F7FA] text-gray-800 placeholder-gray-400 border-2 border-gray-300 shadow-sm focus:outline-none focus:border-blue-400 w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                className="rounded-full py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all duration-300 w-full"
                onClick={handleSignup}
                disabled={loading} // Disable button while loading
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <style>
        {`
          .toast {
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            transition: opacity 0.3s ease-in-out;
          }
          .toast.show {
            opacity: 1;
          }
          .toast.hide {
            opacity: 0;
          }
        `}
      </style>
    </div>
  );
};

export default Auth;
