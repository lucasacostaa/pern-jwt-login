const express = require("express");
const app = express();
const cors = require('cors');

// Middlewares
app.use(express.json()); //bodyParser
app.use(cors())

//Routes//

//Register and login routes

app.use("/auth", require("./routes/jwtAuth.js"))

//Dashboard route
app.use("/dashboard", require("./routes/dashboard"))

app.listen(5000, () => {
    console.log("Running on 5000")
})