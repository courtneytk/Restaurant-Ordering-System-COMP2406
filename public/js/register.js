
//Variables
let user = {};

//Sends a POST request containing the user's data to be added to the server
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
			if(this.readyState==4 && this.status==200){
				let result = this.responseText.substring(12,36);
				alert("Thank you for registering. Welcome!");
				window.location.href = `http://localhost:3001/users/${result}`;
			}
			else if(this.status == 500)
			{
				alert("We could not process you register request. Try a different username, it may already be taken.");
			}
		}
	
		//Send a POST request to the server containing the user data
		request.open("POST", `http://localhost:3001/register`);
		request.setRequestHeader("Content-Type", "application/json");
		request.send(JSON.stringify(user));

	}
	
}

