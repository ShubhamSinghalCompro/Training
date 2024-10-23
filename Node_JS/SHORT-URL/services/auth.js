// const sessionIdToUserMap = new Map();
const jwt = require("jsonwebtoken");
const secret = "secret";
function setUser (sessionId, user) {
    //sessionIdToUserMap.set(sessionId, user);
    console.log(user);
    return jwt.sign({
        _id: user._id,
        email: user.email
    }, secret);
}

function getUser (sessionId) {
    //return sessionIdToUserMap.get(sessionId);
    if(!sessionId) {
        return null;
    }
    try{
        return jwt.verify(sessionId, secret);
    }
    catch(err) {
        return null;
    }
    
}       

module.exports = {  
    setUser,    
    getUser    
}