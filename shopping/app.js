const express = require('express');
const databaseConnection  = require('./Database/connection');
const expressApp = require('./init');
const errorHandler  = require('./Database/side-function/error-handler');
const {CreateChannel} = require('./message-broker/message-broker')
const StartServer = async() => {

    const app = express();
    
    await databaseConnection();
    
    const channel = await CreateChannel();
    
    await expressApp(app,channel);

    errorHandler(app);

    app.listen(process.env.Port);

}
StartServer();