import express from "express";
import session from "express-session";
import Store from "express-session";
const router = express.Router();
const app = express();
import { forwardRole, ensureAuthenticated, ensureAdminAuthenticated } from "../middleware/checkAuth";
import { database, userModel } from "../models/userModel";
import { allowedNodeEnvironmentFlags } from "process";
import RedisStore from "connect-redis";
import { createClient } from "redis";



router.get("/", (req, res) => {
    res.send("welcome");
});

router.get("/", (req, res) => {
  const user = database.find((user) => user.role === "admin");
  if (user) {
    res.render("admin")
  } else {
    res.send("welcome");
  }
});

let redisClient = createClient({
url: "redis://localhost:6379",
});
redisClient
  .connect()
  .then(() => console.log("Connected to Redis"))
  .catch(console.error);

let redisStore = new RedisStore({
  client: redisClient,
});

app.use(
  session({
    store: redisStore,
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

router.get("/admin", ensureAuthenticated, ensureAdminAuthenticated, (req, res) => {
    const user = req.user;
    redisStore.all((error, sessions) => {
      if (error) {
        console.error("Failed to retrieve sessions:", error);
        return res.status(500).send("Error retrieving sessions");
      }

      res.render("admin", {
        user: user,
        sessions: sessions,
      });
    });
  }
);


    export default router;

