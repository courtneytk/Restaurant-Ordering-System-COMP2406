//Initialization of modules and constants
const express = require('express');
const app = express();
const router = express.Router();
const User = require("../models/userModel");
const Order = require("../models/orderModel");


//Parses request body if it is JSON
app.use(express.json()); 

//Routers
router.post('/',createOrder);
router.get('/:order_id',getOrder,sendOrder);

//Retrieves a single user
function getOrder(request,response,next)
{
    Order.findById(request.params.order_id,{_id:1,username:1,restaurantName:1,subtotal:1,total:1,fee:1,tax:1,orders:1})
    .populate()
    .exec(function(err,order){
        if(err || order == null)
        {
            console.log(err);
            response.status(500).send("Server was not able to retrieve the orders");
            return;
        }

        User.findOne({username:order.username})
        .populate()
        .exec(function(err,user){
            if(err || user == null)
            {
                console.log(err);
                response.status(500).send("Server was not able to retrieve the user");
                return;
            }

            if((user.privacy && !request.session.loggedin) || (user.privacy && (order.username != request.session.username)))
            {
                console.log(err);
                response.status(403).send("You cannot access the orders of a private user. You must log in as the private user to do so.");
                return;
            }

            request.order = order;
            next();
        });

    });
    
}


//Sends a user to be either rendered or recieved in json form
function sendOrder(request,response)
{
    response.format({
        'text/html': () => 
        {
            response.set('Content-Type', 'text/html');
            response.status(201);
            response.render('orderSummary', {
                order:request.order
            }); 
        },
        'application/json': () => {
            response.set('Content-Type', 'application/json');
            response.json(request.order)
        },
        'default': () => { response.status(406).send('Not acceptable'); }

    });

}
//Creates a new order for a particular user
function createOrder(request,response)
{

    User.findOne({username:request.session.username},function(err, user){
        if(err || user == null)
        {
            console.log(err);
            return response.sendStatus(500).send("Server was not able to retrieve the provided user");
        }
        if(request.session.username == user.username && request.session.loggedin)
        {
            let order = new Order();
            console.log(request.body);
            order.username = request.session.username;
            order.userid = request.session.userid;
            order.restaurantID = request.body.restaurantID;
            order.restaurantName = request.body.restaurantName;
            order.subtotal = request.body.subtotal;
            order.total = request.body.total;
            order.fee = request.body.fee;
            order.tax = request.body.tax;
            order.orders = request.body.order;

            order.save((err)=>{
                if(err)
                {
                    console.log(err);
                    return response.status(500).send("Server was not able to complete the save");
                }
                return response.sendStatus(200);
            });
            
        }
        else
        {
            return response.status(400).send("We cannot find anyone with that username and/or password. Please try again.");
        }
    });	

}


module.exports = router;
