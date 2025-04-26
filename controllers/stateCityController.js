const StateCity = require("../models/stateCityModel");

exports.createStateWithCities = async (req, res) => {
  const { state, cities } = req.body;

  try {
    const result = await StateCity.insertStateWithCities(state, cities);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error("Error inserting state/cities:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getAllStateCities = async (req, res) => {
  try {
    const data = await StateCity.getAllStatesWithCities();
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error fetching state/cities:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
