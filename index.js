const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet")
const morgan = require("morgan")
const userRoute = require("./Routes/users")
const authRoute = require("./Routes/auth")
const postsRoute = require("./Routes/posts")

dotenv.config();



mongoose.connect(process.env.MONGO_URL)
  .then(()=>console.log('connected'))
  .catch(e=>console.log(e));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

//Routes
app.use("/api/posts",postsRoute)
app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);

app.listen(8800,()=>{
    console.log("backend running")
})