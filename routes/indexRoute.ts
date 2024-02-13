import express from "express";
import sessions, { SessionData } from "express-session";
import store from "express-session";
const router = express.Router();
const app = express();
import { ensureAuthenticated, ensureAdminAuthenticated } from "../middleware/checkAuth";
import { database, userModel } from "../models/userModel";
import { allowedNodeEnvironmentFlags } from "process";


router.get("/", (req, res) => {
    res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  const user = req.user;
  const userRole = req.user?.role;
  const session: any = [];

  if (req.sessionStore.all === undefined) throw new Error("Session Store Error");
  req.sessionStore.all((err, sessions: any) => {
    if(err) {
      console.log(err);
    } else if(sessions != null) {
      const sessionKeys = Object.keys(sessions);
      sessionKeys.forEach((sessionId) => {
        const sessionData = sessions[sessionId];
        const userData = {
          sessionId: sessionId,
          userId: sessionData["passport"].user,
        }
        session.push(userData);
      })
      console.log('All the sessions are: ', sessionKeys);
      if (userRole !== "admin") {
        res.render("dashboard", {user: user});
      } else {
        res.render("admin", { user: user, userData: session});
      }}
  })
});

router.get('/dashboard/revoke/:sessionId', (req, res) => {
  const sessionId = req.params.sessionId;
  console.log(sessionId);
  req.sessionStore.destroy(sessionId, (err) => {
    if(err) throw err;
  })
  res.redirect('/auth/login')
  });


    export default router;


   
