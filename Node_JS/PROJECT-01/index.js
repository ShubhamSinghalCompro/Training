const express = require('express');
const users = require('./MOCK_DATA.json');
const app = express();
const PORT = 8000;
const{logReqRes} = require('./middlewares');
const {connectMongoDB} = require('./config');

const userRouter = require('./routes/user');
app.use('/users', userRouter);

connectMongoDB('mongodb://localhost:27017/project-01');

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(logReqRes('log.txt'));




    
    



app.listen(PORT, () => { console.log(`Listening on port ${PORT}`); });