import express from "express";
import raceController from "../controller/race.controller.js";

const router = express.Router();

router.get('/:event_url', raceController.getRaceResults);


router.get('/edit/:event_url', raceController.getRaceInfo);


router.patch('/edit/:event_url', raceController.editRace);

router.post('/edit/:event_url', raceController.editRace);


export default router;