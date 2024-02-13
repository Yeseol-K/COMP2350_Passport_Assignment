import { NextFunction, Request, Response } from "express";


export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
}

export const forwardAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
}

export const forwardRole = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user && req.user.role === "user") {
    next();
  }
    res.redirect("/admin");
}

export const ensureAdminAuthenticated = (req: Request, res: Response, next: NextFunction) => {
 
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.redirect("/auth/login");
    }
  };



export const ensureUserAuthenticated = (req: Request, res: Response, next: NextFunction) => {
 
    if (req.user && req.user.role === "user") {
      next();
    } else {
    res.redirect("/admin");
    }
  };