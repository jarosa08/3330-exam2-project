import express from "express"
import apiController from "../controller/api.controller.js";
const router = express.Router();

router.get("/races", apiController.getAllRaces);

router.get("/results", apiController.getAllResults);

router.get("/results/:event_url", apiController.listRaceResults);

export default router;