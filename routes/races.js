import express from "express";
import { races } from "./api.js";
import { permitRoles } from "./accounts.js";

const router = express.Router();

// router.get("/races", (req, res)=>{
//   res.status(200).json(races);
// });

router.get('/', async (req, res)=>{
    try {
        // res.render(path.join(import.meta.dirname, "views", "races.ejs"), {races});
        res.render('races.ejs', {races});
    } catch (error) {
        console.error("Error retrieving races:", error);
        res.status(502).send("Unable to retrieve the race catalog. Please try again later.");
    }
 });

router.post('/', permitRoles("ORGANIZER"), (req, res) => {
    try {
        const { updateNameInput, updateURLInput, updateDateInput, updateLocationInput, updateInfoInput, updateMaxRunnersInput, updateTimedByInput} = req.body;

        // check if race already exists
        if (races.some(item => item.name.toLowerCase() === updateNameInput.trim().toLowerCase())){
            console.error("Race with inputted Name already exists.");
            return res.status(409).send("Can't create race. A race with this Name already exists.");
        }
        if (races.some(item => item.event_url.toLowerCase() === updateURLInput.trim().toLowerCase())){
            console.error("Race with inputted URL already exists.");
            return res.status(409).send("Can't create race. A race with this URL already exists.");
        }
        

        const newRace = {
            name: updateNameInput.trim(),
            event_url: updateURLInput.trim(),
            date: updateDateInput,
            location: updateLocationInput.trim(),
            info: updateInfoInput.trim(),
            currentRunners: 0, // set to 0
            maxRunners: Number(updateMaxRunnersInput),
            timedBy: updateTimedByInput.trim(),
            postedBy: req.session.user.firstName + " " + req.session.user.lastName
        };

        // add to race
        races.push(newRace);

        console.log("Race created.");

        return res.redirect('/races');

    } catch (error) {
        console.error("Error processing race creation:", error);
        res.status(500).json({ error: "An internal server error occurred while creating the race." });
    }
});


export default router;