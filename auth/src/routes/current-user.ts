import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
    if (!req.session?.jwt) {
        console.log("jwtToken is null.");
        return res.send({ currentUser: null });
    }

    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
        return res.send({ currentUser: payload });
    } catch (error) {
        console.log("Error verifying jwtToken");
        return res.send({ currentUser: null });
    }
});

export { router as currentUserRouter };