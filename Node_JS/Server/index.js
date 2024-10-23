// const http = require('http'); 
// const fs = require('fs');
// const url = require('url');

// const myServer = http.createServer((req, res) => {
//     if(req.url === '/favicon.ico') {
//         res.end();
//     }
//     console.log("new request");
//     const log = `${new Date().toString()} : ${req.url}\n`;
//     const myUrl = url.parse(req.url, true);
//     console.log(myUrl);
//     const qp = myUrl.query;
//     console.log(qp);
//     const name = qp.name;
//     const uId = qp.uId;
//     console.log(name);
//     console.log(uId);
//     fs.appendFile('log.txt', log, (err) => { if (err) throw err;  
//         switch(myUrl.pathname){
//             case '/about':
//                 res.end(`Hello, ${name}`);
//                 break;
//             case '/favicon.ico':
//                 res.end();
//                 break;
//             case '/':
//                 if(req.method === 'GET') {
//                     res.end(`Hello, ${name}! Your UId is: ${uId}`);
//                 }
                
//                 break;
//             default: 
//                 res.end(`Hello, ${name}! Your UId is: ${uId}`);
//         }
//     });

    
// });

// myServer.listen(8000, () => { console.log("Listening on port 8000"); });

const http = require('http');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    return res.send('Hello From Home Page');
});

app.get('/about', (req, res) => {
    return res.send(`Hello ${req.query.name}`);
});

// const myServer = http.createServer(app);

// myServer.listen(8000, () => { console.log("Listening on port 8000"); }); 

app.listen(8000, () => { console.log("Listening on port 8000"); })