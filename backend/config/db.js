      const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGOURI

   ,
    { 
   
     
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));
