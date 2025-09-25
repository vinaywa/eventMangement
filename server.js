const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const participantRoutes = require("./routes/participantRoutes");
const loginRoute = require("./routes/auth")


const app = express();
app.use(express.json());


mongoose.connect("mongodb://127.0.0.1:27017/eventdb")
  .then(() => console.log("MongoDB Connected...."))
  .catch(err => console.error(err));

app.use("/login",loginRoute);
app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/participants", participantRoutes);



app.listen(5000,()=>{
  console.log("server running on port 5000");
})
  
