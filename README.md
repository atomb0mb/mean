
# Visit
http://cwng-node-angular.s3-website.us-east-2.amazonaws.com/

# M E A N  Stack
MongoDB
Express
Angular
Node

## TBD

 [Angular Material](https://material.angular.io/components/categories)



MongoDB
To view query results on MongoBD Web application
Pre-req: Log into MongoDB account
1. Select the project
2. DATA STORAGE > Clusters > Collections


Quick guide to verify if data is stored on the database via CLI
Pre-req: Log into MongoDB account
1. DATA STORAGE > Clusters > CONNECT
2. Connect with mongo shell
3. Connect to cluster and get the connection string from connection method
4. Enter password 
5. Use node-angular or database you named to switch database
6. In case - 'help' to see command
7. Eg. 'db.posts.find()' to see the queries on CLI

Mongoose
[QUERIES](https://mongoosejs.com/docs/api/query.html)


Multer [Docs] (https://github.com/expressjs/multer)

NodeJs - Nodemon
Instead of restarting the server frequently due to change, there is a script for node.js to auto refresh the change

Installation: https://www.npmjs.com/package/nodemon

Include the script in package.json
  "scripts": {
    "start": "nodemon server.js"
  },

In case "NODEMON — app crashed — waiting for file changes before starting" show up
Reason for that because sometimes PC running several processes in the Background. So you need to stop all the node process that are running:

pkill -f node 

or

sudo lsof -i :3000 //replace 3000 with your port number
sudo kill -9 31363 // replace 31363 with your PID