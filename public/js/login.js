//Variables
let user = {};

//Sends a POST request containing the new user's data to be added to the server
function submit()
{
	user.username = document.getElementById("username").value;
	user.password = document.getElementById("password").value;

	if(user.username == '' || user.password == '')
	{
		alert("You have not entered all the fields, please try again.");
	}
	else
	{
		let request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(this.readyState==4 && this.status==201){
				alert("You have logged in. Welcome!");
				window.location = "http://localhost:3001/home";
			}
			else if(this.status == 400)
			{
				alert("We cannot find anyone with that username and/or password. Please try again.");
			}
			else if(this.status == 500)
			{
				alert("There was an issue on the server, it seems an internal error occured.");
			}
		}
	
		//Send a POST request to the server containing the user data
		request.open("POST", `http://localhost:3001/login`);
		request.setRequestHeader("Content-Type", "application/json");
		request.send(JSON.stringify(user));

	}
	
}
