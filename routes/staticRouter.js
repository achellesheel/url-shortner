 
const express = require("express");
const UrlModel = require("../models/url");
const { restrictToLoggedInUserOnly } = require("../middlewares/auth");
const router = express.Router();



//public routes for login and signup pages.
router.get("/Signup", (req,res) => {
    return res.render("signup");
});

router.get("/login", (req,res) => {
    return res.render("login");
});


//protected route for logged in users only.
router.get("/",restrictToLoggedInUserOnly, async (req, res) => {
    const allUrls = await UrlModel.find({});
    return res.render("home", {
        urls: allUrls,
        user: req.user, // Pass the user object to the template
    });
});

module.exports = router;