const express = require("express");
const {
  handleGenerateNewShortURL,
  handleRedirect,
  handleRedirectURL,
  handleRenderAnalyticsUI,
} = require("../controllers/url");

const { restrictToLoggedInUserOnly } = require("../middlewares/auth");

const router = express.Router();

// POST /URL -> generate a new SHORT URL and return shortened URL

// GET /url/:shortid -> redirect the user to the original URL

// GET /url/anaylytics/:shortid -> numbers of clicks for shortened URL

router.post("/", restrictToLoggedInUserOnly, handleGenerateNewShortURL); 
// only for logged in users --> 
// E.g. In future if we made it paid service, then we can restrict it to paid users only.
// 5 paid apis --> only post login --> BUT WE FORGOT TO AUTHENTICATE BEFORE EVERY USE OF API. --> 
// He will take CURL out of network --> API can be used by anyone. So, we need to authenticate before use of API.

// Nptc6xb4R
//router.get("/:shortId", handleRedirect);

router.get("/:shortId", handleRedirectURL); // --> As we want people to share SHORTURL. 
                                          // So, we don't want to restrict it to logged in users only. 
                                         // So, we removed restrictToLoggedInUserOnly middleware from this route.
// GET /url/analytics/:shortId/view -> Opens analytics table page in the browser
router.get("/analytics/:shortId/view", handleRenderAnalyticsUI);

// router.get('/anaylytics/:shortid',);

module.exports = router;