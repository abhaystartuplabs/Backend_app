const express = require("express");
const userRoutes = require("./Routes/userRoutes");
const scheduledRoutes = require("./Routes/scheduledRoutes");
// const gmbRoutes = require("./Routes/gmbRoutes");
const app = express();
require('dotenv').config(); 
const PORT = process.env.PORT || 8000;
const connectToDb = require("./Config/db");
const cors = require('cors');
require('./cron/cron.js')
require('./cron/scheduler')

/* Handling cors problem */
app.use(cors({
    origin: 'https://backend-app-nu-ebon.vercel.app',
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));


// app.use(cors());
app.use(express.json()); // Use express.json() instead of bodyParser.json()


app.get("/", (req, res) => {
  res.send("Server is running 🔥");
});

app.use("/api/users", userRoutes);
// app.use("/api/gmb", gmbRoutes);
app.use("/api/schedule", scheduledRoutes);

app.get("/api/test", (req, res) => {
  res.send({ message: "Backend running successfully" });
});


connectToDb();

app.listen(PORT, () => {
    console.log(`Server is started on Port ${PORT}`);
});