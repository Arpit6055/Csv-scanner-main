import express from 'express';
import expressLayouts  from 'express-ejs-layouts';
import passport from 'passport';
import flash from 'connect-flash';
const session = require('express-session');
import allRoutes from './routes/index';
import http from 'http';
import passportConfig  from './config/passport';
import path from  'path'
const app = express();
// Passport Config
passportConfig(passport);

// DB Config
import {connectDB, disconnectDB} from './config/db';

connectDB();


const cors = require('cors');
// Cors 
const corsOptions = {
  origin: (process.env.ALLOWED_CLIENTS || "").split(',')
  // ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:3300']
}
app.use(cors(corsOptions));

// EJS
app.use(expressLayouts);
app.set('views', path.join(__dirname, '/../src/views/'));
app.set('view engine', 'ejs');
app.use(express.static('src/public'));
app.use(express.static('./../src/uploads/profile_pic'))

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', allRoutes);


//error page
app.get("*", (req, res)=>{
  res.redirect('/dashboard');
})

const PORT = process.env.PORT || 3000;

let server: http.Server;
const startServer = async () => {
  try {
    server = app.listen(PORT, (): void => {
      console.log(`Connected successfully on port ${PORT}`);
    });
  } catch (error: any) {
    console.error(`Error occurred: ${error.message}`);
  }
};

startServer();


process.on('SIGTERM', () => {
  console.info('SIGTERM received');
  disconnectDB();
  if (server) server.close();
});
