const User = require("../models/user");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
//const {v4:uuidv4} = require("uuid"); 
// no longer needed. We will bcryptjs to hash the password. So we will not store it in plain text.
const { setUserId, removeUserId } = require("../service/auth");

async function handleUserSignUp(req, res) {
    const { name, email, password} = req.body;
    if (!name || !email || !password) {
        return res.status(400).render("signup", {
            error: "All fields are required",
        });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).render("signup", {
            error: "Account with this email already exists",
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
        name,
        email,
        password: hashedPassword,
    });
    return res.redirect("/login");
}

async function handleUserLogin(req, res) {
    const { email, password} = req.body;
    const user = await User.findOne({ email});
    if (!user) {
        return res.status(401).render("login", {
            error: "Invalid email or password",
        });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(401).render("login", {
            error: "Invalid email or password",
        });
    }
     // we should not store this id like we do not store pswd!!
     //  So we have to find a way to store it in server itself!! --> Server memory --> 
     // create a auth.js
    //id will be passed via Headers or cookies. 
   // const sessionId = uuidv4(); // Generate session id
   const sessionId = crypto.randomUUID(); // Generate session id
    setUserId(sessionId,user); // set session id  in server memory with user object.
    res.cookie("uid",sessionId); // send it in cookie via cookie-parser middleware.

    return res.redirect("/");
}

function handleUserLogout(req, res) {
    const sessionId = req.cookies?.uid;
    if (sessionId) {
         removeUserId(sessionId); // Remove the session ID from the server memory
        // Remove the session ID from the server memory
        
    }
   
    res.clearCookie("uid"); // Clear the cookie on the client side
    return res.redirect("/login");
}


module.exports = {
    handleUserSignUp,
    handleUserLogin,
    handleUserLogout,
}