const express = require("express");
const {connectToMongoDB} = require("./connect");
const app = express();
const PORT = 8001;
const urlRoute = require("./routes/url");
const path = require("path");
const cookieParser = require("cookie-parser");
const {restrictToLoggedInUser} = require("./middlewares/auth");
const staticRouter = require('./routes/staticRouter');

const userRoute = require("./routes/user");

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

const URL = require("./models/url");

connectToMongoDB('mongodb://localhost:27017/short-url').then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log('Error connecting to MongoDB',err);
})

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use("/user", userRoute);

app.use(cookieParser());

app.get("/test", async(req, res) => {
    const allUrls = await URL.find();
    return res.render("home", {allUrls: allUrls});
})
app.use("/url",restrictToLoggedInUser, urlRoute);

app.use("/", staticRouter);

app.get("/url/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {"shortId": shortId},
        {$push: {visitHistory: {timestamp: Date.now()}}},
    );
    res.redirect(entry.redirectUrl);
})



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
