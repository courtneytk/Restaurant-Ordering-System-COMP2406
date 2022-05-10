const mongoose = require("mongoose");
const Schema = mongoose.Schema;


let orderSchema = Schema({
    username: {type: String, required: true},
    userid: {type: String, required: true},
	restaurantID: {type: Number, required: true},
	restaurantName: {type: String, required: true},
	subtotal: {type: Number, required: true},
    total:{type: Number, required: true},
	fee: {type: Number, required: true},
    tax: {type: Number, required: true},
    orders: {type: Object, required: true,default:{}},
});

module.exports = mongoose.model("Order", orderSchema); 

