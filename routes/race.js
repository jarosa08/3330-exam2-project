import express from "express";
import path from "node:path";
import { races, results } from "./api.js";
import { permitRoles } from "./accounts.js";

const router = express.Router();

router.get('/:event_url', permitRoles("RUNNER"), (req, res) => {
    try {
        const { event_url } = req.params;

        // convert both strings to .toLowerCase() to match
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


router.get('/edit/:event_url', permitRoles("ORGANIZER"), (req, res) => {
    try {
        const { event_url } = req.params;

        // convert both strings to .toLowerCase() to match
        const targetRace = races.find(item => 
            item.event_url.toLowerCase() === event_url.toLowerCase()
        );

        if (!targetRace) {
            return res.status(404).send(`Race results not found for event: ${event_url}`);
        }

        // res.render(path.join(import.meta.dirname, "views", "edit.ejs"), { results: targetRace });
        res.render('edit.ejs', {races: targetRace});
    } catch (error) {
        console.error("Error retrieving result:", error);
        res.status(500).send("An internal server error occurred.");
    }
});


router.patch('/edit/:event_url', (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: "Please log in first." });
    }
    if (req.session.user.accountType == "RUNNER")
    {
        try {
            // get url
            const { event_url } = req.params;

            // find race
            const targetRace = races.find(item => item.event_url.toLowerCase() === event_url.toLowerCase());

            // if no race found
            if (!targetRace){
                return res.status(404).json({message: "Race not found"});
            }

            // if fill
            if (targetRace.currentRunners >= targetRace.maxRunners) {
                return res.status(400).json({ error: "This race is already full!" });
            }

            // increment
            targetRace.currentRunners += 1;

            return res.status(200).json({message: 'Registered!'});

        } catch (error) {
            console.error("Error processing race registration:", error);
            res.status(500).json({ error: "An internal server error occurred while registering for the race." });
        }
    }
    else if (req.session.user.accountType == "ORGANIZER")
    {
        try {
            const { event_url } = req.params;
            const { name, date, location, info, maxRunners, timedBy} = req.body;

            // Find the index of the target race inside your in-memory array
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
            if (maxRunners) races[targetIndex].maxRunners = maxRunners;
            if (timedBy) races[targetIndex].timedBy = timedBy;

            // 4. Send a clean JSON success status back to your frontend JavaScript
            return res.status(200).json({message: "Race configuration updated successfully!"});

        } catch (error) {
            console.error("Error processing race patch update:", error);
            res.status(500).json({ error: "An internal server error occurred while updating the race." });
        }
    }
    else
    {
        res.status(404).json({message: "Access denied."});
    }
        
});


export default router;