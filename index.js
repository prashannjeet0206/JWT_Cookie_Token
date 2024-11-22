const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

const PORT = process.env.PORT;

// middleware
app.use(express.json());

// Routes
const authRouter = require("./routes/auth.route");
app.use("/auth/v1", authRouter);

// server
app.listen(PORT, () => {
  console.log(`Server running at Port:${PORT}`);
});

// Database
const DB = require("./config/db");
DB();
