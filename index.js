import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import "dotenv/config";
import routes from "./src/routes/index.js";
import axios from "axios";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Proxy route to fetch VAST XML
app.get("/proxy-vast", async (req, res) => {
  try {
    const vastUrl =
      "https://servedby.revive-adserver.net/fc.php?script=apVideo:vast2&zoneid=21108";
    const response = await axios.get(vastUrl);
    res.set("Content-Type", "application/xml"); // Set the content type to XML
    res.send(response.data); // Send the VAST XML as the response
  } catch (error) {
    console.error("Error fetching VAST XML:", error);
    res.status(500).send("Error fetching VAST XML");
  }
});

app.use("/api/v1", routes);

const port = process.env.PORT || 5000;

const server = http.createServer(app);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Mongodb connected");
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log({ err });
    process.exit(1);
  });
