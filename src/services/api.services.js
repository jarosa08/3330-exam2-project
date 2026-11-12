const races = [
  {
    name: "Edinburg 10K",
    event_url: "Edinburg-10K",
    date: "2026-03-02",
    location: "Edinburg, TX",
    info: "10K Run",
    currentRunners: 12,
    maxRunners: 50,
    timedBy: "SpotOn",
    postedBy: "John Doe",
    registeredUsers: []
  },
  {
    name: "Edinburg 5K",
    event_url: "Edinburg-5K",
    date: "2026-11-13",
    location: "Edinburg, TX",
    info: "5K Run",
    currentRunners: 12,
    maxRunners: 50,
    timedBy: "SpotOn",
    postedBy: "John Doe",
    registeredUsers: []
  },
  {
    name: "Edinburg Fun Run",
    event_url: "Edinburg-Fun-Run",
    date: "2027-04-02",
    location: "Edinburg, TX",
    info: "1 Mile Fun Run",
    currentRunners: 4,
    maxRunners: 50,
    timedBy: "SpotOn",
    postedBy: "John Doe",
    registeredUsers: []
  }
];

const results = [
  {
    "race_info": {
      "event_name": "Edinburg 5K",
      "event_url": "Edinburg-5K",
      "distance": "5K",
      "total_participants": 12
    },
    "divisions": {
      "male": {
        "M20-29": [
          {"place": 1, "bib": "M104", "name": "David Kiprop", "age": 28, "time": "00:13:42", "pace": "4:25/mile"},
          {"place": 2, "bib": "M115", "name": "Daniel Smith", "age": 26, "time": "00:14:08", "pace": "4:33/mile"},
          {"place": 3, "bib": "M108", "name": "Hiroshi Tanaka", "age": 29, "time": "00:14:19", "pace": "4:36/mile"},
          {"place": 4, "bib": "M110", "name": "Carlos Mendez", "age": 27, "time": "00:14:55", "pace": "4:48/mile"}
        ],
        "M30-39": [
          {"place": 1, "bib": "M101", "name": "Michael Cheruiyot", "age": 31, "time": "00:13:51", "pace": "4:27/mile"},
          {"place": 2, "bib": "M122", "name": "Arnaud Dubois", "age": 34, "time": "00:14:36", "pace": "4:42/mile"}
        ]
      },
      "female": {
        "F20-29": [
          {"place": 1, "bib": "F205", "name": "Ruth Chepngetich", "age": 29, "time": "00:15:12", "pace": "4:54/mile"},
          {"place": 2, "bib": "F208", "name": "Marta Silva", "age": 27, "time": "00:15:52", "pace": "5:06/mile"},
          {"place": 3, "bib": "F219", "name": "Fiona O'Keeffe", "age": 28, "time": "00:16:15", "pace": "5:14/mile"}
        ],
        "F30-39": [
          {"place": 1, "bib": "F202", "name": "Brigid Kosgei", "age": 32, "time": "00:15:05", "pace": "4:51/mile"},
          {"place": 2, "bib": "F211", "name": "Emily Sisson", "age": 31, "time": "00:15:34", "pace": "5:01/mile"},
          {"place": 3, "bib": "F214", "name": "Yuki Nakamura", "age": 33, "time": "00:16:31", "pace": "5:19/mile"}
        ]
      }
    }
  },
  {
    "race_info": {
      "event_name": "Edinburg 10K",
      "event_url": "Edinburg-10K",
      "distance": "10K",
      "total_participants": 12
    },
    "divisions": {
      "male": {
        "M20-29": [
          {"place": 1, "bib": "M402", "name": "Liam O'Connor", "age": 24, "time": "00:32:15", "pace": "5:11/mile"},
          {"place": 2, "bib": "M415", "name": "Marcus Vance", "age": 27, "time": "00:34:42", "pace": "5:35/mile"},
          {"place": 3, "bib": "M409", "name": "Jordan Mitchell", "age": 22, "time": "00:36:10", "pace": "5:49/mile"},
          {"place": 4, "bib": "M431", "name": "Alexei Ivanov", "age": 29, "time": "00:38:25", "pace": "6:11/mile"}
        ],
        "M30-39": [
          {"place": 1, "bib": "M511", "name": "Ryan Gallagher", "age": 35, "time": "00:31:50", "pace": "5:07/mile"},
          {"place": 2, "bib": "M504", "name": "Tyler Nguyen", "age": 32, "time": "00:35:18", "pace": "5:41/mile"}
        ]
      },
      "female": {
        "F20-29": [
          {"place": 1, "bib": "F603", "name": "Chloe Jenkins", "age": 25, "time": "00:36:45", "pace": "5:55/mile"},
          {"place": 2, "bib": "F612", "name": "Hannah Berg", "age": 28, "time": "00:39:12", "pace": "6:18/mile"},
          {"place": 3, "bib": "F607", "name": "Elena Rostova", "age": 23, "time": "00:41:04", "pace": "6:36/mile"}
        ],
        "F30-39": [
          {"place": 1, "bib": "F701", "name": "Sarah Jenkins", "age": 34, "time": "00:35:58", "pace": "5:47/mile"},
          {"place": 2, "bib": "F718", "name": "Rachel Taylor", "age": 31, "time": "00:38:05", "pace": "6:08/mile"},
          {"place": 3, "bib": "F709", "name": "Maria Rossi", "age": 37, "time": "00:42:30", "pace": "6:50/mile"}
        ]
      }
    }
  }
];

const listRaces = () => {
  return races;
}

const findRaceByName = (params) => {
  return races.find(item => item.name.toLowerCase() === params.toLowerCase());
}

const findRaceByURL = (params) => {
  return races.find(item => item.event_url === params);
}

const createRace = (req) => {
  const { updateNameInput, updateURLInput, updateDateInput, updateLocationInput, updateInfoInput, updateMaxRunnersInput, updateTimedByInput} = req.body;

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
}

const updateRace = (req) => {
  const { name, date, location, info, maxRunners, timedBy} = req.body;

  let targetRace = findRaceByURL(req.params.event_url);

  if (name) targetRace.name = name.trim();
  if (date) targetRace.date = date;
  if (location) targetRace.location = location.trim();
  if (info) targetRace.info = info.trim();
  if (maxRunners) targetRace.maxRunners = Number(maxRunners);
  if (timedBy) targetRace.timedBy = timedBy.trim();
}

const listResults = () => {
  return results;
}

const findRaceResults = (params) => {
  return results.find(item => item.race_info.event_url.toLowerCase() === params.toLowerCase());
}

export default {listRaces, findRaceByName, findRaceByURL, createRace, updateRace, listResults, findRaceResults}