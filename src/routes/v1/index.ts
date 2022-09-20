import { Router } from "express";
import dashboard from "./dashboard";

const routes = Router();
routes.use("/dashboard", dashboard);

export default routes;
