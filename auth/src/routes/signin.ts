import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { validateRequest } from "@nmbiyutickets/common";
import { BadRequestError } from "@nmbiyutickets/common";
import { User } from "../models/user";
import { Password } from "../services/password";

const router = express.Router();

router.post('/api/users/signin',
    [
        body("email")
            .isEmail()
            .withMessage("Email must be valid"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("You must supply a password")
    ], validateRequest, async (req: Request, res: Response) => {

    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new BadRequestError("Invalid credentials");
    }

    const passwordsMatch = await Password.compare(existingUser.get("password"), password);
    if (!passwordsMatch) {
        throw new BadRequestError("Invalid credentials");
    }

    // Generate JWT
    // JWT Secret has been created in Kubernetes with the following command.
    // kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
    // kubectl get secrets can be used to list the secrets.
    // We do not want to have a config file for this as it would expose the key.
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    }, process.env.JWT_KEY!); // The ! tells TypeScript that we have checked the type of process.env.JWT_KEY.
                              // See check at index.ts#start

    // Store it on session object
    req.session = {
        jwt: userJwt
    };

    return res.status(200).send(existingUser);
});

export { router as signinRouter };