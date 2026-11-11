import express from "express";
import bodyParser from "body-parser";
import session from "express-session";

import apiRoutes from "./routes/api.js";
import basicRoutes from "./routes/basic.js"
import racesRoutes from "./routes/races.js";
import accountRoutes from "./routes/accounts.js";
import raceRoutes from "./routes/race.js";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.use(session({
  secret: "racehub-secure-session-key", // Your unique encryption phrase signature token
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // Session cookie token expires in 24 hours
}));

// This loops through memory automatically so your header.ejs never throws undefined errors!
app.use((req, res, next) => {
    res.locals.user = req.session.user || null; 
    next();
});

app.use('/', basicRoutes);
app.use('/api', apiRoutes);
app.use('/races', racesRoutes);
app.use('/login', accountRoutes);
app.use('/race', raceRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});