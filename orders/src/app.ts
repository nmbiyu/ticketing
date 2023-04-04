import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from "cookie-session";
import { currentUser } from "@nmbiyutickets/common";

import { deleteOrderRouter } from "./routes/delete";
import { indexOrderRouter } from "./routes/index";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";

const app = express();
app.set('trust proxy', true); // Ingress nginx is our proxy. We need to tell Express to trust it.
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));
app.use(currentUser);

app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

export { app };