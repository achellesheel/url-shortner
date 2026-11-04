const path = require('path');
const express = require("express");
const UrlModel = require("./models/url");
const urlRoute = require("./routes/url");
const { connectToMongoDB } = require("./connect"); //middleware
const cookieParser = require('cookie-parser');
const staticRoute = require("./routes/staticrouter");
const { restrictToLoggedInUserOnly } = require("./middlewares/auth");
const app = express();
const userRoute = require("./routes/user");
const PORT = 3000;

connectToMongoDB("mongodb://127.0.0.1:27017/short-urls")
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("error while connecting DB", err));


app.set('view engine', 'ejs'); 
// telling express to use ejs as nito boost for tesla roadster; one time setting and not middleware
app.set('views',path.resolve('./views'));

app.use(express.urlencoded({ extended: false }));

app.use(express.json()); // middleware only for raw json
app.use(cookieParser());

app.use("/user", userRoute); // all routes starting with /user will be handled by userRoute
app.use("/", staticRoute); // all routes starting with / will be handled by staticRoute

// app.get("/ejs", (req,res)=> {
//     res.render("home");
// });

app.get("/ejs", async (req, res) => {
    const urls = await UrlModel.find({});
    return res.render("home", { urls });
});

// app.get("/", async (req, res) => {
//     const allUrls = await UrlModel.find({});
//     //const people = "code kerdos";
//     //res.render("home",{title:'Home', people});
//     res.render("home", {urls:allUrls});
// });

app.use("/",restrictToLoggedInUserOnly,staticRoute); //middleware to restrict access to logged in users only.);

// app.get('/html',async (req ,res) => {
//     const allUrls = await UrlModel.find({});
//     return res.end(`
//         <html>
//             <head></head>
//             <body>
//                 <ol>
//                     ${allUrls.map(url => `<li>${url.shortid} - ${url.redirectURL}</li>`)}
//                 </ol>
//             </body>
//         </html>
//     `);
// });

app.use("/url", urlRoute);

app.listen(PORT, () => console.log(`server up and running on ${PORT}`));