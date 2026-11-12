const homePage = (req, res) => {
    res.render('home.ejs');
};

const calculatorPage = (req, res) => {
    res.render('calculator.ejs');
};

export default {homePage, calculatorPage}