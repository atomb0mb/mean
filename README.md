# MEAN STACK web application

demo: http://cwng-node-angular.s3-website.us-east-2.amazonaws.com/

### Quick start
[`User`](#users-guides)

[`Developer`](#developers-guides)

## Main Technology for MEAN
* [MongoDB](https://www.mongodb.com/cloud/atlas)
* [Express](https://expressjs.com/)
* [Angular](https://angular.io/docs)
* [Node](https://nodejs.org/en/)

## Additional technologies and tools
* [Angular Material](https://material.angular.io/components/categories) for UI component infrastructure and Material Design components
* [Mongoose](https://mongoosejs.com/) as middleware and object modeling for nodejs
* [Multer](https://github.com/expressjs/multer) as middleware to handle image upload in this project
* [Nodemon](https://www.npmjs.com/package/nodemon) as tool for nodejs restart
* [bcryptjs](https://www.npmjs.com/package/bcryptjs) for password encryption
* [jsonwebtoken](https://jwt.io/) as auth for token request

## Project Description
I always want to build my MEAN stack. After learning Angular, I start building a MEAN application. A blog page that allows users to post and manage their posts. Everyone can see the post with or without an account. User with an account can create a post that includes a title, picture, and description. Only the creator can manage the post content. Simple as that! I have lots of ideas for this project and likely to continue developing and updating this project. 


## Overview
* The current homepage display all posts.
* Everyone can view posts created by each user.
* Only post creator can edit or delete his or her post.
* Each post contains a title, image, and description.
* Default pagination is 2 posts per page. The page content display can be set to user preference

## Security
* This web application has no SSL. Highly recommend to use provided sample account or using a dummy/DNE email & password when creating an account.
* The unauthorized user is restricted to URL access. It will redirect the unauthorized user to the home page.
* Auto logout user on session expiry and user need to re-login again 

## Users Guides

Sample account
| EMAIL      | PASSWORD           |
| ------------- |:-------------:| 
| test@hotmail.com | 123456 | 

### Use case 1 - Create an account or Login with an exisiting accont
Login with sample account
1. Navigate to Login tab
2. Enter email & password
3. Click > Login

To Create a new account
1. Navigate to Sign up tab
2. Enter a valid email
3. Enter a password that its length must greater than 6
4. Click > Sign up

### Use case 2 - Create a post
1. Enter your Email and Password then clicks > Login.
2. After login, click 'New Post' tab that appeared on the top right
3. Enter title
4. Upload an image
5. Enter description
6. Click 'Save'

### Use case 3 - Edit a post
Pre: Login into your account
1. Select a post
2. On the bottom right of the post, click 'EDIT'
3. Edit one or more of the following or all(you can also do nothing): title, image, description
4. Click 'Save'

### Use case 4 - Delete a post
Pre: Login into your account
1. Select a post
2. On the bottom right of the post, click 'DELETE'





## Developers Guides
### Important set up when setting your deployment
* Replace your apiUrl on src/environments/environment.prod.ts or src/environments/enviroment.ts if you have different local port
* Set up your process.env Mongodb usr & password in backend/app.js
* Set up your process.env json web token in backend/controllers/user.js

### MongoDB
#### To view query results on MongoBD Web application
Pre-req: Log into MongoDB account
1. Select the project
2. DATA STORAGE > Clusters > Collections


#### Quick guide to verify if data is stored on the database via CLI
Pre-req: Log into MongoDB account
1. DATA STORAGE > Clusters > CONNECT
2. Connect with mongo shell
3. Connect to cluster and get the connection string from connection method
4. Enter password 
5. Use node-angular or database you named to switch database
6. In case - 'help' to see command
7. Eg. 'db.posts.find()' to see the queries on CLI

### Mongoose
Reference for [QUERIES](https://mongoosejs.com/docs/api/query.html)

### Multer 
[Documentation](https://github.com/expressjs/multer)

### NodeJs - Nodemon
For productivity, this tool helps automatically restarting the node application when file changes in the directory are detected.

My set up in package.json
  "scripts": {
    "start": "nodemon server.js"
  },
  
### Troubleshooting for Nodemon
In case "NODEMON — app crashed — waiting for file changes before starting" show up.

Reason for that because sometimes PC running several processes in the Background. So you need to stop all the node process that are running:

> pkill -f node 

> or

> sudo lsof -i :3000 //replace 3000 with your port number
> sudo kill -9 31363 // replace 31363 with your PID

### Some common errors when setting up the server whether in local or virtual machine
- Check node environment for production and development
- Understand cross origin resource sharing (CORS)
- Exposing to correct port or pointing to correct domain
- Ip configuration address when setting up the database
- Google is your best friend





