import apiServices from '../services/api.services.js'

const racesPage = async (req, res)=>{
    try {
        res.render('races.ejs', {races: apiServices.listRaces()});
    } catch (error) {
        console.error("Error retrieving races:", error);
        res.status(502).send("Unable to retrieve the race catalog. Please try again later.");
    }
};

const createRace = (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: "Please log in first." });
    }
    if (req.session.user.accountType == "ORGANIZER")
    {
        try {
            // check if race exists based off name
            let raceNameExists = apiServices.findRaceByName(req.body["updateNameInput"]);

            // check if race exists based off url
            let raceURLExists = apiServices.findRaceByURL(req.body["updateURLInput"]);
            
            // check if race already exists
            if (raceNameExists){
                console.error("Race with inputted Name already exists.");
                return res.status(409).send("Can't create race. A race with this Name already exists.");
            }
            if (raceURLExists){
                console.error("Race with inputted URL already exists.");
                return res.status(409).send("Can't create race. A race with this URL already exists.");
            }
            
            apiServices.createRace(req);

            console.log("Race created.");

            return res.redirect('/races');

        } catch (error) {
            console.error("Error processing race creation:", error);
            res.status(500).json({ error: "An internal server error occurred while creating the race." });
        }
    }
    else
    {
        res.status(404).json({message: "Access denied."});
    }
};


export default {racesPage, createRace};