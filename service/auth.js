const sessionIdToUserMap = new Map();

//these are just wrapper. we are using MAP in behind. 
// we can change the implementation later if we want to create logout page

function setUserId(id, user) {
    sessionIdToUserMap.set(id, user);
}

function getUserBysessionId(id){             
    return sessionIdToUserMap.get(id);
}
//whenever you login, we generate 
// unique session id (associated with user) and store it in server memory.
// We send it back to user via cookie. Next time user sends request, 
// we get the session id from cookie and get the user from server memory.

function removeUserId(id) {
    sessionIdToUserMap.delete(id);
}

module.exports = {
    setUserId,
    getUserBysessionId,
    removeUserId,
}