Purpose: 

Created a webpage which allows users to login, see users, make restaurant orders, see their order history, as well as see the order histories of other users and purchase meals at various restaurants. Additionally, there is authentication to prevent non-logged in users from seeing restaurant options, etc. 

Languages & Concepts:

Javascript DOM hierarchy, Node.js, Mongoose, MongoDB, PUG, HTML, Express, Sessions, Server-client interaction and seperation.

Design Choices: 

In terms of functionality, I made sure to seperate (as much as possible) computations from display/layout and made sure to use
modularity by making functions that generally accomplish one key task (eg. displaying user options, logging in, etc).

Additionally, I included a router sepcific to /users and /orders related requests to streamline my computations in one place 
and make my program more understandable.

Finally, I chose to use Mongoose rather than solely implement Mongo because of the access to Schema's which greatly organize and 
simplify the program itself. Also, I personally found it easier to search,update and manipulate collections using Mongoose and since those are common operations in this program, I believed Mongoose would be the best option.

Checking Requirements in the Mongo Shell:

If you check whether everything is being stored in the database, please note that for an unknown reason (for now), the session data may end up in the "test" database under the "sessions" collection rather than your "a4" (or whatever database you will use) database under "sessions". If the sessions data does come under the right folder in your database, then you can disregard this note.

Webpage Layout:

Using some flex CSS components, I made my page clean and easy to navigate. Additionally, I included percentages for width's of divs and other containers within the webpage to ensure that the layout will
stay constant no matter where the webpage is opened on.
Overall I opted for a clean webpage that performs all the functions required in this program without added hassle.

Do note that for the order form page, when you add items to the order, the order summary on the right hand side may drop down to the bottom of the page but has not disappeared. You can still submit the order successfully.


Notes to Launch and Run: 

Launch: 

1. In your IDE terminal enter the following to install the dependencies needed: npm install

2. Make sure to have mongoDB installed, and open a command prompt/terminal on your computer and enter the following to establish the mongo daemon: mongod --dbpath="NameOfYourDirectoryForMongoDatabase"
   
    i. To note: Make sure you have a folder designated for the database within the directory where all the files of this program are 

To run the program:

Proceed to run "node database-initializer.js" to initialize all the databased information. Note that my initializer is modified
because I wanted to make use of Mongoose. You will also notice I intialized a schema within this file as well.

Finally, write "node server.js" within your IDE terminal to run the server.

Then either click the link that appears when the server is running or type
"http://localhost:3001" into your browser (ideally Google Chrome).