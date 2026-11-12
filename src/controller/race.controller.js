import express from "express";
import apiServices from '../services/api.services.js'

const getRaceResults = (req, res) => {
    try {
        const targetRace = apiServices.findRaceResults(req.params.event_url);

        if (!targetRace) {
            return res.status(404).send(`Race results not found for event: ${event_url}`);
        }

        res.render('race.ejs', {results: targetRace});
    } catch (error) {
        console.error("Error retrieving result:", error);
        res.status(500).send("An internal server error occurred.");
    }
};


const getRaceInfo = (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: "Please log in first." });
    }
    if (req.session.user.accountType == "ORGANIZER")
    {
        try {

            // convert both strings to .toLowerCase() to match
            const targetRace = apiServices.findRaceByURL(req.params.event_url);

            if (!targetRace) {
                return res.status(404).send(`Race results not found for event: ${event_url}`);
            }

            res.render('edit.ejs', {races: targetRace});
        } catch (error) {
            console.error("Error retrieving result:", error);
            res.status(500).send("An internal server error occurred.");
        }
    }
    else
    {
        res.status(404).json({message: "Access denied."});
    }
};


const editRace = (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: "Please log in first." });
    }
    if (req.session.user.accountType == "RUNNER")
    {
        try {
            // find race
            const targetRace = apiServices.findRaceByURL(req.params.event_url);

            // if no race found
            if (!targetRace){
                return res.status(404).json({message: "Race not found"});
            }

            // if filled
            if (targetRace.currentRunners >= targetRace.maxRunners) {
                return res.status(400).json({ error: "This race is already full!" });
            }

            if (!targetRace.registeredUsers) {
                targetRace.registeredUsers = [];
            }

            const userEmail = req.session.user.email.toLowerCase();
            if (targetRace.registeredUsers.includes(userEmail)) {
                return res.status(400).json({ error: "You are already registered for this race!" });
            }

            // increment
            targetRace.currentRunners += 1;
            targetRace.registeredUsers.push(userEmail);

            return res.status(200).json({message: 'Registered!'});

        } catch (error) {
            console.error("Error processing race registration:", error);
            res.status(500).json({ error: "An internal server error occurred while registering for the race." });
        }
    }
    else if (req.session.user.accountType == "ORGANIZER")
    {
        try {
            const targetIndex = apiServices.findRaceByURL(req.params.event_url);
            
            if (!targetIndex) {
                return res.status(404).json({ error: `Race not found for event: ${event_url}` });
            }

            apiServices.updateRace(req);

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
};


export default {getRaceResults, getRaceInfo, editRace};