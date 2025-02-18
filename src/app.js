import express from "express";
import router from "./router.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cors from "cors";

const app = express(process.env.CORS_ORIGIN);

app.use(express.json());

app.use(cors());

app.use(router);

app.use(errorHandler);

export default app;
