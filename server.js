// app.js
const $ = require('jquery');
global.jQuery = $;
const session = require('express-session');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const routes = require('./routes/routes');
const connectionRoutes=require('./routes/connectionRoutes')
const uploadsRoutes=require('./routes/uploadsRoutes')
const databaseRoutes=require('./routes/databaseRoutes')
const authenticate = require('./middlewares/auth');
const { isAdmin, isUser } = require('./middlewares/roles');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
//const flash = require('flash-message');


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(flash());


app.use(session ({
  secret : process.env.secretKey,
  resave: true,
  saveUninitialized: true
}))
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});
// Set views directory
app.set('views', path.join(__dirname, 'views'));

// Set static directory for public files
app.use(express.static(path.join(__dirname, '')));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('view cache',false)




// Import routes
app.use('/',routes);
app.use('/connection',connectionRoutes);
app.use('/',authenticate,uploadsRoutes);
// Protect /gestion and its subroutes with authenticate middleware
//app.use('/gestion', authenticate, databaseRoutes); 
app.use('/gestion',authenticate,databaseRoutes); 

app.get(['/','/home'], authenticate,(req, res) => {
  res.render('home');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
