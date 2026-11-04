const { getUserBysessionId } = require("../service/auth");

function restrictToLoggedInUserOnly(req, res, next){   //middleware function to restrict access to logged in users only.                 
    const userId = req.cookies?.uid;
    if(!userId){
        return res.redirect("/login");
    }
    const user = getUserBysessionId(userId);
    if(!user){
        return res.redirect("/login");
    }
    req.user = user;// so that, we can know user info //  Pass info from middleware to next function in the route handler.
                    // So that we can use it in the route handler.
    return next();
}

module.exports = {
    restrictToLoggedInUserOnly,
};