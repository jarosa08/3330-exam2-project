import express from "express"
import accountsController from '../controller/accounts.controller.js'

const router = express.Router();

router.get('/', accountsController.loginPage);

router.post("/", accountsController.signIn);

export default router;