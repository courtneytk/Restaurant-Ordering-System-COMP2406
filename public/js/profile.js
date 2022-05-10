let user = {};

user = object;

function init1()
{
    document.getElementById("off").checked = true;
}

function init2()
{
    document.getElementById("on").checked = true;
}

function onClicked()
{
    document.getElementById("on").checked = true;
    document.getElementById("off").checked = false;
}

function offClicked()
{
    document.getElementById("on").checked = false;
    document.getElementById("off").checked = true;
}


//Submitting a user object with updated privacy settings to the server
//Why is sending response object sending undefined to updateUser router???????????***************
function submit()
{
    if(document.getElementById("off").checked == true)
    {
        user.privacy = false;
    }
    else if(document.getElementById("on").checked == true)
    {
        user.privacy = true;
    }

    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if(this.readyState == 4 && this.status==201)
        {
            alert("You have successfully updated the privacy of your profile.");
        }
        else if(this.status == 500)
        {
            alert("There was an issue on the server, it seems an internal error occured.");
        }
    }

    //Send a POST request to the server containing the user data
    request.open("POST", `http://localhost:3001/users/${user._id}`); //possible??????????????
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(user));

	
	
}
