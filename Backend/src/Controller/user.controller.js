import User from "../models/User.model.js";
import FriendRequest from "../models/FriendRequest.js";



export async function getRecommandedUsers(req, res) {
    try {
        const userId = req.user.id;
        const users = req.user;
        
        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: userId } },
                { _id: { $nin: users.friends } },
                {isonboarded: true}
            ]
        })
        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error("Error in getRecommandedUsers:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function getFriends(req, res) {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId)
        .select("friends")
        .populate("friends","FullName profilepic Email Password bio nativelanguage learningLanguage isOnboarded ");
        return res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getFriends:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function sendFriendRequest(req, res){
    try{
        const userId = req.user.id;
        const { id:recipientId } = req.params;

        if(userId === recipientId){
            return res.status(400).json({ error: "You cannot send a friend request to yourself" });
        }

        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(400).json({ error: "Recipient not found" });
        }

        if(recipient.friends.includes(userId)){
            return res.status(400).json({ error: "You are already friends with this user" });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: userId, recipient: recipientId },
                { sender: recipientId, recipient: userId },
            ],
        });
        if(existingRequest){
            return res.status(400).json({ error: "Friend request already exists" });
        }

        const friendRequest = await FriendRequest.create({
            sender: userId,
            recipient: recipientId,
        });
        return res.status(200).json({ message: "Friend request sent successfully" });

    }catch(error){
        console.error("Error in sendFriendRequest:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function acceptFriendRequest(req, res){
    try{
        const {id:requestId} = req.params

        const friendRequest = await FriendRequest.findById(requestId);

        if(!friendRequest){
            return res.status(404).json({ message:"Friend request not found"})
        }

        if(friendRequest.recipient.toString() !== req.user.id){
            return res.status(403).json({ message:"You are not authorized to accept this friend request"})
        }

        friendRequest.status = "accepted";
        await friendRequest.save();


        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{friends:friendRequest.recipient}
        })

        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet:{friends:friendRequest.sender}
        })

        return res.status(200).json({ message:"Friend request accepted successfully"})
        
    }catch (error){
        console.error("Error in acceptFriendRequest:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function getFriendRequests(req, res){
    try{
        const incoming = await FriendRequest.find({
            recipient:req.user.id,
            status:"pending"
        })
        .populate("sender","FullName profilepic nativelanguage learningLanguage ")
        
        const acceptFriendRequest = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted",
        }).populate("recipient","FullName profilepic");


        res.status(200).json({incoming,acceptFriendRequest});

    }catch (error){
        console.error("Error in getFriendRequests:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function getOutgoingFriendRequests(req, res){
    try{
        const outgoing = await FriendRequest.find({
            sender: req.user.id,
            status: "pending",
        }).populate("recipient","FullName profilepic nativelanguage learningLanguage ");
        res.status(200).json(outgoing);
    }catch (error){
        console.error("Error in getOutgoingFriendRequests:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function rejectFriendRequest(req, res){
    try{
        const {id:requestId} = req.params

        const friendRequest = await FriendRequest.findById(requestId);

        if(!friendRequest){
            return res.status(404).json({ message:"Friend request not found"})
        }

        if(friendRequest.sender.toString() !== req.user.id){
            return res.status(403).json({ message:"You are not authorized to reject this friend request"})
        }

        friendRequest.status = "rejected";
        await friendRequest.save();

        return res.status(200).json({ message:"Friend request rejected successfully"})
        
    }catch (error){
        console.error("Error in rejectFriendRequest:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}