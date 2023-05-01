const express = require("express");
const cors = require("cors");
const { success, error } = require("consola");
const { connect } = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/files", express.static("./public/files"));

app.get("/", (req, res) => {
    res.send("Yo boi wassup")
});


app.use("/mw/api/v1/auth", require("./routes/userRoute"));
app.use("/mw/api/v1/player", require("./routes/playerRoute"));

app.use((req, res, next) => {
    res.status(404).json({
        status: 404,
        error: "Page not found"
    })
})

const startApp = () => {
    try {
        connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });

        success({
            message: `Successfully connected wtih database`, badge: true
        });


        app.listen(process.env.PORT, () => success({
            message: `Server started on port ${process.env.PORT}`, badge: true
        }))
    } catch (err) {
        error({
            message: `Connection terminated \n ${err}`, badge: true
        })
    }
}

startApp();