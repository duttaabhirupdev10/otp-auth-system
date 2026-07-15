import { Router } from "express";
import { register } from "../controllers/auth.controller.js";

const authRouter = Router();

// POST /api/auth/register
authRouter.post("/register", register);

authRouter.post("/login", (req, res) => {
  // Handle login logic here
  res.send("Login route");
});

export default authRouter;