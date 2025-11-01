import {StreamChat} from "stream-chat";
import "dotenv/config"


const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    throw new Error("Stream API key or secret not found");
}

const Streamclient = StreamChat.getInstance(apiKey, apiSecret);


export const createStreamUser = async (userData) => {
    try {
        await Streamclient.upsertUsers([userData]);
        return userData;
    }catch(error){
        console.error("Error creating Stream user:", error);
        throw error;
    }
};

export const upsertStreamUser = async (userData) => {
    try {
        await Streamclient.upsertUsers([userData]);
        return userData;
    }catch(error){
        console.error("Error upserting Stream user:", error);
        throw error;
    }
}

export const generateStreamToken = async (userId) => {
    try{
       const userIdStr = userId.toString();
       const token = Streamclient.createToken(userIdStr);
       return token;
    }catch(error){
        console.error("Error generating Stream token:", error);
        throw error;
    }
}


 
