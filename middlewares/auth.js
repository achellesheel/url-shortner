const { getUserId } = require("../service/auth");

function restrictToLoggedInUserOnly(req, res, next){
    const userId = req.cookies?.uid;
    if(!userId){
        return res.redirect("/login");
    }
    const user = getUserBysessionId(userUid);
    if(!user){
        return res.redirect("/login");
    }
    return next();
}

module.exports = {
    restrictToLoggedInUserOnly,
};