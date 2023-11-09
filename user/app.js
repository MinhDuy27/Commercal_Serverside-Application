const express = require('express');
const databaseConnection  = require('./Database/connection');
const expressApp = require('./init');
const errorHandler  = require('./Database/side-function/error-handler');
const {RPCObserver} = require("./RPC/rpc");


const StartServer = async() => {

    const app = express();
    
    await databaseConnection();
    
    await expressApp(app);

    errorHandler(app);

    app.listen(process.env.Port);
    RPCObserver("USER-RPC");// RPC implementation for communicating

}
StartServer();