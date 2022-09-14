require('dotenv').config();
let dbPassword = `${process.env.MONGO_CONNECTION_URL}`;
export default {mongoURI: dbPassword};
