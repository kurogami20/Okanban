import express from "express";
import router from "./router.js";
import { errorHandler } from "./middleware/errorHandler.js";
const app = express();

app.use(express.json());

app.use(router);

app.use(errorHandler);

export default app;
