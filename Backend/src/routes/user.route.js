import express from "express";
import { getFriends, getRecommandedUsers } from "../Controller/user.controller.js";
import { protectRoute } from "../Middleware/auth.middleware.js";
import { sendFriendRequest } from "../Controller/user.controller.js";



const router = express.Router();

router.use(protectRoute);


router.get("/", getRecommandedUsers);
router.get("/friends", getFriends);

router.post("/friend-request/:id", sendFriendRequest);



export default router
