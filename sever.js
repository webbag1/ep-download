const express = require("express");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname)));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


async function getEpisodeLink(episode) {
  const url = `https://ww20.gogoanimes.fi/one-piece-dub-episode-${episode}`;
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const downloadLink = $('li.dowloads a').attr('href');
    return downloadLink || null;
  } catch (err) {
    console.error(`Error fetching Episode ${episode}:`, err);
    return null;
  }
}


app.get("/get-links", async (req, res) => {
  const { start, end } = req.query;
  const startEpisode = parseInt(start, 10);
  const endEpisode = parseInt(end, 10);

  const promises = [];
  for (let i = startEpisode; i <= endEpisode; i++) {
    promises.push(getEpisodeLink(i));
  }

  try {
    const links = await Promise.all(promises);
    res.json({ links });
  } catch (error) {
    console.error("Error fetching links:", error);
    res.status(500).json({ error: "Failed to fetch links" });
  }
});


app.listen(PORT);
