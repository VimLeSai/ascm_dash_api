import { Router } from "express";
import { counts, list } from "../../../services/dashboard";

const routes = Router();
routes.get("/chart", list);
routes.get("/counts", counts);

export default routes;
