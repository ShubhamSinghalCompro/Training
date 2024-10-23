const fs = require('fs');

function logReqRes(filename){
    return (req, res, next) => {
        fs.appendFile(filename, `\n${new Date().toString()} : ${req.method} ${req.path}`, (err) => { if (err) throw err; 
            next();
        });
    }
}

module.exports = {logReqRes}; //exporting logReqRes