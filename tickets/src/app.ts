import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@nmbiyutickets/common";

import { createTicketRouter } from "./routes/new";

const app = express();
app.set('trust proxy', true); // Ingress nginx is our proxy. We need to tell Express to trust it.
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));
app.use(currentUser);

app.use(createTicketRouter);

export { app };