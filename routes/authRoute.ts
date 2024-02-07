import express from "express";
import passport from 'passport';
import { forwardAuthenticated } from "../middleware/checkAuth";
import { getUserByEmailIdAndPassword } from "../controllers/userController";
import { userModel } from "../models/userModel";
import { Session } from "inspector";

const router = express.Router();
declare module "express-session" {
  interface SessionData {
    messages: string[];
  }
}
router.get("/login", forwardAuthenticated, (req, res) => { 
  const errorMsg = (req.session.messages);
  res.render("login", {errorMsg: errorMsg});
})

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true,
  })
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

export default router;