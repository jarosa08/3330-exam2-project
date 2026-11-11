import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    res.render('home.ejs');
});

router.get('/calculator', (req, res) => {
    res.render('calculator.ejs');
});

export default router;
