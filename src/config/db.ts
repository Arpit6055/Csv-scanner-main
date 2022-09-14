require('dotenv').config();
import mongoose, { Connection } from 'mongoose';
let connection: null | Connection = null;
const URI = process.env.MONGO_CONNECTION_URL || "";

async function connectDB() {
    // Connect the client to the server (optional starting in v4.7)
    mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology:true }).then(() => {
        console.log('Connected successfully to database 😁😁😁');
    }).catch((error: Error) => {
            console.log('Connection with DB failed ☹️☹️☹️☹️');
            if (connection) connection.close();
            throw error;
    });
}


function disconnectDB() {
    if (connection) {
        connection.close(() => {
            console.info('Connection closed ☹️☹️☹️☹️');
        });
    }
}


export { disconnectDB, connectDB };