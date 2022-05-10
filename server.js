//Initialization of modules and constants
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();
const MongoDBStorage = require('connect-mongodb-session')(session);
const User = require('./models/userModel'); //Can connect to the collections
app.use(express.json()); 


//Import the routers for each case
const usersRouter = require('./routers/users-router');
const ordersRouter = require('./routers/orders-router');

//Setting up the session
const store = new MongoDBStorage({
    mongoUrl:'mongodb://localhost/a4', 
    collection: 'sessions'
});
store.on('error',(error) => {console.log(error)}); //Handling any errors that may occur in setup

//Setting up middleware

//Sets the template engine so will be used when render is called
app.set('view engine', 'pug');

//Serves static files of js, HTML, CSS form
app.use(express.static('public')); 

//Parses request body if it is JSON
app.use(express.json()); 

//Parses form data sent in
app.use(express.urlencoded({extended: true}));

//Setup the session
app.use(session({ 
    name: "a4-session",
    secret: "sunny days are coming around",
    cookie:
    {
        maxAge: 1000*60*60*24*1 //Cookies stay for 1 day with this
    },
    store: store,
    resave: true, //Updating idle sessions
    saveUninitialized: false //Not storing empty sessions
}));

//Logging request that are recieved - for tracking
app.use(function(request,response,next){
    console.log(`${request.method} for ${request.url}`);
    next();
});

//Server routes
app.use(exposeSession);
app.post('/login',login);
app.post('/register',register);
app.get('/logout',logout);
app.use('/orders',auth,ordersRouter);
app.use('/users',usersRouter);

//Exposing the session to engines (pug, etc.)
function exposeSession(request,response,next)
{
    if(request.session)
    {
        response.locals.session = request.session;
        next();
    }
}

//Homepage rendering
app.route(['/','/home'])
.get((request,response)=>{
    response.render('home');
});

//Registration page rendering
app.route('/register')
.get((request,response)=>{
    if(request.session.loggedin) 
    {
        response.status(403).send("You must log out prior to accessing this form.");
    }
    else
    {
        response.render('register');
    }
});

//Rendering the order form
app.route('/orderForm')
.get((request,response)=>{
    if(!request.session.loggedin) 
    {
        response.status(403).send("You must be logged in to access this form.");
    }
    else
    {
        response.render('orderForm');
    }
});

//Rendering the login form
app.get('/login',(request,response)=>{
    if(request.session.loggedin) 
    {
        response.status(403).send("You must log out prior to accessing this form.");
    }
    else
    {
        response.render('login');
    }
});

//Authorization of whether a user is a private profile
function auth(request,response,next)
{
    if(!request.session.loggedin && request.session.userprivacy) 
    {
        response.status(403).send("You must log in prior to accessing this resource");
    }
    else
    {
        next();
    }
}

//Register a new user
function register(request,response)
{
    if(request.body)
    {
        console.log(request.body);
    }
    let user = new User();
    user.username = request.body.username;
    user.password = request.body.password;
    user.privacy = false;

    user.save((err)=>{
        if(err || request.body == {} || user == null)
        {
            console.log("FOO");
            console.log(err);
            return response.status(500).send("Server was not able to complete the register request");
        }
        else
        {
            request.session.loggedin = true;
            request.session.username = user.username;
            request.session.userid = user._id;
            request.session.userprivacy = false;
            response.locals.session = request.session; 


            return response.status(200).send({message:user._id});
        }
        
 
       
    });

}


//Logging in a user
function login(request,response,next)
{
    if(request.session) 
    {
        if(request.session.loggedin) 
        {
            return response.status(201).send("You are already logged in.");
        }
        User.findOne({username:request.body.username}, function(err, user){
            if(err)
            {
                return response.sendStatus(500);
            }
            if(user == null || request.body.username != user.username || request.body.password != user.password)
            {
                return response.sendStatus(400);
            }
            else if(request.body.username == user.username && request.body.password == user.password)
            {
                request.session.loggedin = true;
                request.session.username = user.username;
                request.session.userid = user._id;
                request.session.userprivacy = user.privacy;
                response.locals.session = request.session; 

                response.sendStatus(201);
                return;
            }
            
            
        });	

    }
}

//Logs out the user and deletes any session data
function logout(request,response,next)
{

    request.session.destroy(); 
    delete response.locals.session;
   
    response.status(200).redirect('/home');
    
}

//Connection to the database
mongoose.connect('mongodb://localhost/a4',{useNewUrlParser:true,useUnifiedTopology:true});

let db = mongoose.connection;

db.on('error', console.error.bind(console,'Error connecting to database'));
db.once('open',function(){
    User.init(()=>{
        app.listen(3001,()=>console.log(`Server listening at port 3001: http://localhost:3001`));
    })
});