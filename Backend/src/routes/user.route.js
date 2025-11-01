import express from "express";
import { getFriends, getRecommandedUsers, sendFriendRequest, acceptFriendRequest, getFriendRequests ,getOutgoingFriendRequests ,rejectFriendRequest } from "../Controller/user.controller.js";
import { protectRoute } from "../Middleware/auth.middleware.js";



const router = express.Router();

router.use(protectRoute);


router.get("/", getRecommandedUsers);
router.get("/friends", getFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.put("/friend-request/:id/reject", rejectFriendRequest);



router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendRequests);



export default router
