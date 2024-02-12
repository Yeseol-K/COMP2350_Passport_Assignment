import express from "express";
import sessions from "express-session";
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
  if (req.sessionStore.all === undefined) throw new Error("Session Store Error");
  req.sessionStore.all((err, sessions) => {
    if(err) {
      console.log(err);
    }
    if(sessions != null) {
      const sessionKeys = Object.keys(sessions);
      console.log('all the sessions are: ', sessionKeys);
      if (userRole !== "admin") {
        res.render("dashboard", {user: user});
      } else {
        res.render("admin", { user: user, sessions: sessionKeys });
      }}
  })
});

router.get('/dashboard/revoke', (req, res) => {
  if (req.sessionStore.all === undefined) throw new Error("error appears.");
  req.sessionStore.all((err, sessions) => {
    if(err) {
      console.log(err);
    }
    if (sessions != null) {
      const sessionKeys = Object.keys(sessions);
      sessionKeys.forEach(sessionKey => {
        req.sessionStore.destroy(sessionKey, (err) => {
          if(err) throw err;
        })
      }
      )}
      res.redirect('/auth/login')
  })
})

    export default router;

