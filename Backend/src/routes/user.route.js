import express from "express";
import { getFriends, getRecommandedUsers, sendFriendRequest, acceptFriendRequest } from "../Controller/user.controller.js";
import { protectRoute } from "../Middleware/auth.middleware.js";



const router = express.Router();

router.use(protectRoute);


router.get("/", getRecommandedUsers);
router.get("/friends", getFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);





export default router
