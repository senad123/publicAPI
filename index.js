import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const URLCoordinate = "http://api.openweathermap.org/geo/1.0/direct?q=";
const URLResult = "https://api.openweathermap.org/data/2.5/";
const apiKey = "appid=642f5ee2171426c487005adb039ebe28";
const apiKeyW = "b9ace628c0436bed13e4fc999eddf2e3";
const config = {
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
};

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let content = "";
let selectedCity = "";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "Choice your city" });
});

app.post("/", async (req, res) => {
  selectedCity = req.body.type;
  console.log(selectedCity);
  let lat, lon, country, city, icon; // Declare variables here
  // console.log("URLCoordinate: ", URLCoordinate + selectedCity + "&limit=1&" + apiKey);
  try {
    const coordinateResponse = await axios.get(
      URLCoordinate + selectedCity + "&limit=1&" + apiKey,
      config,
    );
    country = coordinateResponse.data[0].country;
    city = coordinateResponse.data[0].name;
    lat = coordinateResponse.data[0].lat;
    lon = coordinateResponse.data[0].lon;

    const weatherResponse = await axios.get(
      URLResult +
        "weather?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        apiKeyW +
        "&units=metric",
      config,
    );
    //console.log("Weather Result:", weatherResponse.data);
    console.log(weatherResponse.data.main.temp);
    icon =
      "https://openweathermap.org/img/w/" +
      weatherResponse.data.weather[0].icon +
      ".png";
    console.log(icon);
    res.render("index.ejs", {
      cityData: coordinateResponse.data[0],
      weatherData: weatherResponse.data.main,
      icon: icon,
    });

    // Send the weather data as a response
    //res.status(200).json(weatherResponse.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message,
    );
    res
      .status(500)
      .send(error.response ? error.response.data : "Internal Server Error");
    return; // Stop execution if there's an error
  }
});

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
