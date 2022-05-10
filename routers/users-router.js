//Initialization of modules and constants
const express = require('express');
const app = express();
const router = express.Router();
const User = require("../models/userModel");
const Order = require("../models/orderModel");

//Parses request body if it is JSON
app.use(express.json()); 

//Routers
router.get('/',getUsers, sendUsers);
router.get('/:user_id',getUser,getOrders,sendUser);
router.post('/:user_id',updateUser,sendUser);

//Gets all the users requested for
function getUsers(request,response,next)
{
    if(request.query.name)
    {
        const query = { username: { $regex: new RegExp(`^${request.query.name}$`), $options: 'si' } };
        User.find(query)
        .populate()
        .exec(function(err, users){
            if(err || !users || users == null)
            {
                console.log(err);
                response.status(500).send("Server was not able to retrieve the users"); 
                return;
            
            }
            else if(users.privacy)
            {
                console.log("You cannot access users that are private. Try again.");
                response.status(403);
            }
            
            request.users = users;
            next();
        })
    }
    else
    {
        User.find()
        .populate()
        .exec(function(err,users){
            if(err || users == null)
            {
                console.log(err);
                response.status(500).send("Server was not able to retrieve the users");
                return;
            }
            request.users = users;
            next();
        })
    }
    
}

//Retrieves a single user
function getUser(request,response,next)
{
    User.findById(request.params.user_id,{_id:1,username:1,privacy:1})
    .populate()
    .exec(function(err,user){
        if(err || user == null)
        {
            console.log(err);
            response.status(500).send("Server was not able to retrieve the user");
            return;
        }
        if(user.privacy && !request.session.loggedin || (user.privacy && user.username != request.session.username))
        {
            console.log(err);
            response.status(403).send("You cannot access the profile of a private user. You must log in as the private user to do so.");
            return;
        }
        
        request.user = user;
        next();
    });
    
}

function getOrders(request,response,next)
{
    
    Order.find({username:request.user.username})
        .populate()
        .exec(function(err,order){
            if(err || order == null)
            {
                console.log(err);
                response.status(500).send("Server was not able to get the orders of the user");
                return;
            }
            if(request.user.privacy && ((!request.session.loggedin || request.session.username != request.user.username))) 
            {
                console.log(err);
                response.status(403).send("You cannot access the orders of a private user. You must log in as the private user to do so.");
                return;
            }
            request.order = order;
            next();
        });
}

//Sends a user to be either rendered or recieved in json form
function sendUser(request,response)
{
    response.format({
        'text/html': () => 
        {
            response.set('Content-Type', 'text/html');
            response.status(201);
            response.render('profile', {
                user:request.user,
                order:request.order
            });
        },
        'application/json': () => {
            response.set('Content-Type', 'application/json');
            response.json(request.user,request.order)
        },
        'default': () => { response.status(406).send('Not acceptable'); }

    });

}


//Sends the user data and is dependent on the requested format (HTML, or JSON)
function sendUsers(request,response)
{
    response.format({
        'text/html': () => 
        {
            response.set('Content-Type', 'text/html');
            response.render('users', {users:request.users});
        },
        'application/json': () => {
            response.set('Content-Type', 'application/json');
            response.json(request.users)
        },
        'default': () => { response.status(406).send('Not acceptable'); }

    });

}

//Updates the privacy setting for a user
function updateUser(request,response,next)
{
    User.findById(request.params.user_id,{_id:1,username:1,privacy:1})
    .populate()
    .exec(function(err,user)
    {
        if(err || user == null)
        {
            console.log(err);
            response.status(500).send("Server was not able to change the privacy setting of the user");
            return;
        }

        user.privacy = request.body.privacy;

        User.updateOne({username:user.username}, {privacy:user.privacy},function (err, doc) 
        {
            if (err) 
            {
                response.status(500).send("Server was not able to change the privacy setting of the user");
                throw err;
            }
            else
            {
                console.log("Updated Privacy Information in Backend: ",doc);
            }
            
            
        request.order = user.username;
        request.user = user;
        next();
        
        })

        
    })

}

module.exports = router;
