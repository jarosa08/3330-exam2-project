import apiServices from '../services/api.services.js'

const getAllRaces = (req, res)=>{
  res.status(200).json(apiServices.listRaces());
};

const getAllResults = (req, res)=>{
  res.status(200).json(apiServices.listResults());
};

const listRaceResults = (req, res) => {
  
  // Find the specific item where race_info.event_url matches the parameter
  const match = apiServices.raceResults(req.params);
  
  if (!match) {
    return res.status(404).json({ error: "Race result not found" });
  }
  
  res.status(200).json(match);
};

export default {getAllRaces, getAllResults, listRaceResults}