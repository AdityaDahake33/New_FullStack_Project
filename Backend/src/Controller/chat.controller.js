import { generateStreamToken } from "../DB/Stream.js";


export async function getStreamToken(req, res){
    try{
        const userId = req.user.id;
        const token = await generateStreamToken(userId);
        res.status(200).json({token});
    }catch(error){
        console.error("Error in getStreamToken:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}