const app = require("./app");
const connectDatabase = require("./db/Database");
const mongoose = require("mongoose");

// Handling uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server for handling uncaught exception`);
  });

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "backend/config/.env",
  });
}

  
// connect db
mongoose.connect('mongodb://127.0.0.1:27017/e-commerce', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connection successful!'))
  .catch((err) => console.error(err));
  

// create server
const server = app.listen(8000, () => {
  
    console.log(
      `Server is running on http://localhost:${process.env.PORT}`
    );
  });
  
  // unhandled promise rejection
  process.on("unhandledRejection", (err) => {
    console.log(`Shutting down the server for ${err.message}`);
    console.log(`shutting down the server for unhandle promise rejection`);
  
    server.close(() => {
      process.exit(1);
    });
  });
  