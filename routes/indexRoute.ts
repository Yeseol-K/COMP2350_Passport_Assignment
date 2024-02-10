import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import { database, userModel } from "../models/userModel";

router.get("/", (req, res) => {
    res.send("welcome");
});

router.get("/admin", (req, res) => {
  const user = database.find((user) => user.role === "admin");
  if (user) {
    res.render("admin")
  } else {
    res.redirect("dashboard");
  }
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

export default router;
