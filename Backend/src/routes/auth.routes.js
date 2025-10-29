import express from "express";
import { Signup, Login, Logout, onboard } from "../Controller/auth.controller.js";
import { protectRoute } from "../Middleware/auth.middleware.js";


const router = express.Router()


router.post("/Signup", Signup);
router.post("/Login", Login);
router.post("/Logout", Logout);

router.post("/onboarding", protectRoute, onboard);

//check if user is logged in
router.get("/check", protectRoute, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});



export default router