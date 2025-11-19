const express = require("express");
const userRoutes = require("./Routes/userRoutes.js");
const scheduledRoutes = require("./Routes/scheduledRoutes.js");
// const gmbRoutes = require("./Routes/gmbRoutes");
const app = express();
require('dotenv').config(); 
const PORT = process.env.PORT || 8000;
const connectToDb = require("./Config/db.js");
const path = require("path");
const cors = require('cors');
require('./cron/scheduler.js')

/* Handling cors problem */
app.use(cors());

app.use("/Public", express.static(path.join(__dirname, "Public")));

app.use(express.json()); // Use express.json() instead of bodyParser.json()


app.get("/", (req, res) => {
  res.send("Server is running 🔥");
});

app.use("/api/users", userRoutes);
// app.use("/api/gmb", gmbRoutes);
app.use("/api/schedule", scheduledRoutes);


connectToDb();

app.listen(PORT, () => {
    console.log(`Server is started on Port ${PORT}`);
});