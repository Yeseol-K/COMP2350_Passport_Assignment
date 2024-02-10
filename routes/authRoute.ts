import express, { Router } from "express";
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
//local login
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

//github login
router.get("/login/github",
  passport.authenticate('github'));

router.get("/github/callback",
  passport.authenticate('github', { 
    failureRedirect: '/auth/login' }),
  function(req, res) {
    res.redirect('/dashboard');
  });


router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

export default router;