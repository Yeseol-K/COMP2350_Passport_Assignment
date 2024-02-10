import passport from "passport";
import { Strategy as GitHubStrategy } from 'passport-github2';
import { PassportStrategy } from '../../interfaces/index';
import { Request } from 'express';
import { VerifyCallback } from 'passport-oauth2'
import { userModel } from "../../models/userModel";
require('dotenv').config()
import dotenv from "dotenv"
dotenv.config({ })

const githubStrategy: GitHubStrategy = new GitHubStrategy (
    {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: "http://localhost:8000/auth/github/callback",
        passReqToCallback: true,
    },
    
    async (req: Request, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) => {
        const user: Express.User = userModel.findOrCreate(profile);
          done(null, user);
    },
);



const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

export default passportGitHubStrategy;
