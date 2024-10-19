import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const maxAge = 3 * 24 * 60 * 60 * 1000; 

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};

export const signup = async (request, response) => {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).send("Email and Password are required...");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(409).send("User already exists.");
        }

        const user = await User.create({ email, password });

        // Set the JWT cookie
        response.cookie("jwt", createToken(email, user._id), {
            maxAge,
            httpOnly: true,
            secure: false, 
            sameSite: "None" 
        });

        return response.status(201).json({
            user: {
                id: user._id, 
                email: user.email,
                profileSetup: user.profileSetup,
            },
        });
    } catch (error) {
        console.log(error); 
        return response.status(500).send("Internal Server Error");
    }
};

//login section

export const login = async (request, response) => {
    try {
      const { email, password } = request.body;
  
      if (!email || !password) {
        return response.status(400).send("Email and password are required.");
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return response.status(404).send("Email is not registered.");
      }
  
      const auth = await compare(password, user.password);
      if (!auth) {
        return response.status(400).send("Password is incorrect.");
      }
      response.cookie("jwt", createToken(email, user._id), {
        maxAge,
        httpOnly: true,
        secure: false, 
        sameSite: "None", 
      });
      
      return response.status(200).json({
        user: {
          id: user._id,
          email: user.email,
          profileSetup: user.profileSetup,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
          color: user.color,
        },
      });
    } catch (error) {
      console.error(error);
      return response.status(500).send("Internal Server Error");
    }
  };
  