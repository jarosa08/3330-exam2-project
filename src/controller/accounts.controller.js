import bcrypt from 'bcrypt'
import accountServices from '../services/accounts.services.js'

const loginPage = (req, res) => {
    res.render('login.ejs');
};

const signIn = (req, res) => {

  // if new user/empty first name input
  let newUser = (req.body["first-name-input"]?.trim() != "");
  try {
    // const registeredUser = users.find( (user) => user.email.toLowerCase() === email.toLowerCase());
    const registeredUser = accountServices.findUser(req.body);
    if (!newUser){
        // - if all good, send them to the secret page
        if(registeredUser){
        
            if (req.body["passwordinput"] === registeredUser.password) {
                req.session.user = registeredUser;
                return res.redirect("/races");
            }
            bcrypt.compare(req.body["passwordinput"], registeredUser.password, (err, result) => {
                if(err){
                    console.error("Error comparing passwords.");
                }else{
                    if (result) {
                        req.session.user = registeredUser;
                        // Pass the verified database user
                        return res.redirect("/races");
                    }else{
                        res.send("Incorrect password.");
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
            bcrypt.hash(req.body["passwordinput"], 10, (err, hashedPassword) => {
                if (err) {
                    console.error("Bcrypt hash error:", err);
                    return res.status(500).send("Error securely creating your account.");
                }

                req.body["passwordinput"] = hashedPassword;
                // Log them in automatically so they don't have to re-login right away
                req.session.user = accountServices.addUser(req.body);
                console.log("Database updated successfully! New Account:", req.session.user);

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
};

export default {loginPage, signIn}