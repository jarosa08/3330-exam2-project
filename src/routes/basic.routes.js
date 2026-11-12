import express from "express";
import basicController from '../controller/basic.controller.js'

const router = express.Router();

router.get('/', basicController.homePage);

router.get('/calculator', basicController.calculatorPage);

export default router;
