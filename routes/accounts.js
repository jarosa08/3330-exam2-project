import express from "express"
import bcrypt from "bcrypt";
import { users } from "./api.js";

const router = express.Router();
const saltRounds = 10;

// A reusable security guard that accepts any string roles you pass it
export function permitRoles(...allowedRoles) {
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

router.get('/', (req, res) => {
    res.render('login.ejs');
});

router.post("/", (req, res) => {
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

export default router;