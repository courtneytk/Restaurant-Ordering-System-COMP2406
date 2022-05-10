const mongoose = require("mongoose");
const User = require("./models/userModel"); //Can connect to the collections

let userNames = ["winnifred", "lorene", "cyril", "vella", "erich", "pedro", "madaline", "leoma", "merrill",  "jacquie"];
let users = [];

userNames.forEach(name =>{
	let u = new User;
	u.username = name;
	u.password = name;
	u.privacy = false;
	users.push(u);
});

mongoose.connect('mongodb://localhost/a4',{useNewUrlParser:true,useUnifiedTopology:true});

let db = mongoose.connection;

db.on('error', console.error.bind(console,'Error connecting to database'));
db.once('open',(err)=>{
	if(err)
	{
		console.log("Could not drop database");
		throw err;
	}
	console.log("Database was cleared successfully. Re-creating the data....");
	User.init((err)=>{ 
		if(err)
		{
			throw err;
		}
		User.insertMany(users,(err) =>{
			if(err)
			{
				console.log("Could not drop the database");
				throw err;
			}
			console.log(`${users.length} users successfully added (should be 10).`);
			db.close();
		})
	})

});