require("dotenv").config();

const app = require("./app")
const mongoose = require("mongoose")
const ConnectDB = require("./config/db");

ConnectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT , () => {
    console.log(`Server Started on the PORT ${PORT}`);
})