import express from "express";
import path from "node:path";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import session from "express-session";

// 1. IMPORT the results array directly from your routes file
import racesRouter, { users, races, results } from "./routes/races.js"; 

const app = express();
const port = 3000;
const saltRounds = 10;


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

app.use('/api', racesRouter);

// A reusable security guard that accepts any string roles you pass it
function permitRoles(...allowedRoles) {
    return (req, res, next) => {
        // 1. Is there an active login session?
        if (!req.session || !req.session.user) {
            return res.status(401).send("Access Denied: Please log in first.");
        }

        // 2. Is their accountType included in your permitted roles array?
        const hasPermission = allowedRoles.includes(req.session.user.accountType);
        
        if (!hasPermission) {
            return res.status(403).send(`Access Denied: This area is restricted to [${allowedRoles.join(', ')}] profiles only.`);
        }

        // 3. Passed all tests, move to the route controller logic!
        next();
    };
}


app.get('/', (req, res)=>{
    res.render('home.ejs');
    // res.render(path.join(import.meta.dirname, "views", "index.ejs"));
});

app.get('/calculator', (req, res)=>{
    // res.render(path.join(import.meta.dirname, "views", "calculator.ejs"));
    res.render('calculator.ejs');
});

app.get('/races', async (req, res)=>{
    try {
        const allRaces = races;

        // // Request games from the separate API application
        // const resource = "http://localhost:3000/api/races";
        // const response = await fetch(resource);

        // if (!response.ok) {
        //     throw new Error(`API returned ${response.status}`);
        // }
        // const races = await response.json();
        res.render(path.join(import.meta.dirname, "views", "races.ejs"), {races});
        // res.render('races.ejs', raceList);
    } catch (error) {
        console.error("Error retrieving races:", error);
        res.status(502).send(
            "Unable to retrieve the race catalog. Please try again later."
        );
    }
    // res.render(path.join(import.meta.dirname, "views", "races.ejs"));
});

app.get('/race/:event_url', permitRoles("RUNNER"), (req, res) => {
    try {
        const { event_url } = req.params;

        // FIX: Convert both strings to .toLowerCase() to match flawlessly
        const targetRace = results.find(item => 
            item.race_info.event_url.toLowerCase() === event_url.toLowerCase()
        );

        if (!targetRace) {
            return res.status(404).send(`Race results not found for event: ${event_url}`);
        }

        // res.render(path.join(import.meta.dirname, "views", "race.ejs"), { results: targetRace });
        res.render('race.ejs', {results: targetRace});
    } catch (error) {
        console.error("Error retrieving result:", error);
        res.status(500).send("An internal server error occurred.");
    }
});


app.get('/race/edit/:event_url', permitRoles("ORGANIZER"), (req, res) => {
    try {
        const { event_url } = req.params;

        // convert both strings to .toLowerCase() to match flawlessly
        const targetRace = races.find(item => 
            item.event_url.toLowerCase() === event_url.toLowerCase()
        );

        if (!targetRace) {
            return res.status(404).send(`Race results not found for event: ${event_url}`);
        }

        // res.render(path.join(import.meta.dirname, "views", "race.ejs"), { results: targetRace });
        res.render('edit.ejs', {races: targetRace});
    } catch (error) {
        console.error("Error retrieving result:", error);
        res.status(500).send("An internal server error occurred.");
    }
});

app.patch('/race/edit/:event_url', permitRoles("ORGANIZER"), (req, res) => {
    try {
        const { event_url } = req.params;
        
        // 1. Destructure the editable fields coming from your HTML form fields payload
        const { name, date, location, info, timedBy} = req.body;

        // 2. Find the index of the target race inside your in-memory array
        const targetIndex = races.findIndex(item => 
            item.event_url.toLowerCase() === event_url.toLowerCase()
        );

        if (targetIndex === -1) {
            return res.status(404).json({ error: `Race not found for event: ${event_url}` });
        }

        // 3. Mutate the target fields inside the array if they were provided in the request
        if (name) races[targetIndex].name = name;
        if (date) races[targetIndex].date = date;
        if (location) races[targetIndex].location = location;
        if (info) races[targetIndex].info = info;
        if (timedBy) races[targetIndex].timedBy = timedBy;

        // 4. Send a clean JSON success status back to your frontend JavaScript
        return res.status(200).json({message: "Race configuration updated successfully!"});

    } catch (error) {
        console.error("Error processing race patch update:", error);
        res.status(500).json({ error: "An internal server error occurred while updating the race." });
    }
});


app.get('/login', (req, res)=>{
    // res.render(path.join(import.meta.dirname, "views", "calculator.ejs"));
    res.render('login.ejs');
});

// app.post("/login", (req, res) => {
//   const email = req.body.emailinput;
//   const password = req.body.passwordinput;

//   try {
//     const registeredUser = users.find( (user) => user.email === email);
    
//     // TODO: validate user credentials 
//     // - if all good, send them to the secret page
//     if(registeredUser){
//       if (password === registeredUser.password) {
//         req.session.user = registeredUser;
//         return res.redirect("/races");//, {user:registeredUser, races});
//       }
//       bcrypt.compare(password, registeredUser.password, (err, result) => {
//         if(err){
//           console.error("Error comparing passwords.");
//         }else{
//           if (result) {
//             req.session.user = registeredUser;
//             // Pass the verified database user
//             res.redirect("/races");//, { user: registeredUser, races });
//           }else{
//             res.send("Incorrect password.", registeredUser.password, password);
//           }
//         }
//       });

//       // if(password === registeredUser.password)
//       //   res.render("secrets.ejs");
//       // else
//       //   res.send("Incorrect password.");
//     }
//     // - otherwise, display an error when the user is not found or invalid password
//     else{
//       res.send("Email doesn't exist.");
//     }

   
//   } catch (err) {
//     console.log(err);
//   }
// });

app.post("/login", (req, res) => {
  const reqData = req.body;

  const fName = reqData["first-name-input"];
  const lName = reqData["last-name-input"];
  const dob = reqData["DOB-input"];
  const gender = reqData["gender-input"];
  const email = reqData["emailinput"];
  const password = reqData["passwordinput"];
  const accType = reqData["type-input"];

  let newUser = (fName.trim() != "");
  try {
    const registeredUser = users.find( (user) => user.email.toLowerCase() === email.toLowerCase());

    if (!newUser){
        // TODO: validate user credentials 
        // - if all good, send them to the secret page
        if(registeredUser){
        
            if (password === registeredUser.password) {
                req.session.user = registeredUser;
                return res.redirect("/races");//, {user:registeredUser, races});
            }
            bcrypt.compare(password, registeredUser.password, (err, result) => {
                if(err){
                console.error("Error comparing passwords.");
                }else{
                if (result) {
                    req.session.user = registeredUser;
                    // Pass the verified database user
                    return res.redirect("/races");//, { user: registeredUser, races });
                }else{
                    res.send("Incorrect password.", registeredUser.password, password);
                }
                }
            });
        }else{
            res.send("Email doesn't exist.");
        } 
    }else{
        try {
            // const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
            if (registeredUser) {
                return res.status(409).send("An account with this email address already exists.");
            }

            // 3. Encrypt the password safely using bcrypt before saving
            bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) {
                console.error("Bcrypt hash error:", err);
                return res.status(500).send("Error securely creating your account.");
            }

            // 4. Build the user object matching your database structure
            const createdUser = {
                firstName: fName,
                lastName: lName,
                dob: dob,
                gender: gender,
                email: email,
                password: hashedPassword, // Stores the secure hash string
                // Converts "RUNNER" or "ORGANIZER" into lowercase "runner" or "organizer"
                accountType: accType 
            };

            // 5. Push to memory and log the user in instantly via the session tracker
            users.push(createdUser);
            console.log("Database updated successfully! New Account:", createdUser);

            // Log them in automatically so they don't have to re-login right away
            req.session.user = createdUser;

            // 6. Redirect back to the main races board cleanly
            return res.redirect("/races");
            });

        } catch (error) {
            console.error("Registration route crash:", error);
            res.status(500).send("Internal server error during profile signup.");
        }
    }
  } catch (err) {
    console.log(err);
  }
    
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});