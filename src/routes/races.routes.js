import express from "express";
import racesController from "../controller/races.controller.js";
// import { races } from "./api.routes.js";
// import { permitRoles } from "./accounts.routes.js";

const router = express.Router();

// router.get("/races", (req, res)=>{
//   res.status(200).json(races);
// });

router.get('/', racesController.racesPage);

router.post('/', racesController.createRace);


export default router;