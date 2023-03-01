import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from 'jsonwebtoken';

import { RequestValidationError } from "../errors/request-validation-error";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";

const router = express.Router();

router.post('/api/users/signup', [
    body('email')
        .isEmail()
        .withMessage("Email must be valid"),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters')
    ], async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
        throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    // JWT Secret has been created in Kubernetes with the following command.
    // kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
    // kubectl get secrets can be used to list the secrets.
    // We do not want to have a config file for this as it would expose the key.
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY!); // The ! tells TypeScript that we have checked the type of process.env.JWT_KEY.
                              // See check at index.ts#start

    // Store it on session object
    req.session = {
        jwt: userJwt
    };

    return res.status(201).send(user);
});

export { router as signupRouter };