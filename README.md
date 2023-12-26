# NerddevCodingTest
There were two problem sets. Problem set1 and Problem set2 . Code of Problem set1 is in Task1 folder and Problem set2 is in Task2 folder. 

### Software Install 
* Install Visual Studio Code(vscode) if its not installed.
* Install node if its not installed.
* Install MongoDB from www.mongodb.com. Then you will have mongodbCompass to store the data.
* Install Postman to test api. Install from www.postman.com

## Task 1 
Description: The problem is asking  to implement logic in  API endpoint that checks the time elapsed since the last support ticket request for a particular user. If it has been more than 30 minutes, save the new support ticket in the database and respond with a success message and the document ID. If it has been 30 minutes or less, respond with a conflict message indicating that the user needs to wait at least one hour before sending another request.


### How to run the Task 1 project ? 
* First of all download the full project. Open the Task1 folder in vscode. 
* Install some dependencies which were used in Task 1 project. Go to the vscode bar -> Terminal -> New Terminal
* After New Terminal opens run the command : `npm install `. The dependencies will reinstall for your workspace.
* If this don't work then run this command `npm install express body-parser mongoose moment `
* Then run this command `npm install -D nodemon`. All the dependencies are installed now.  
* Open mongoDbCompass and connect. Then come back to vscode.    
* Open the terminal run the command `npm start` to start. you will see Server is running at http://localhost:3000 . DB is connected.
* To Test the API. Open postman ->new connection -> Go to the bar bar and write `http://localhost:3000/support/create_ticket` and select POST.click send.
* if you didn't request in the last 30 minute then it will show response code:200 OK. Then to add data go to Body -> Raw ->select JSON. add some data it will go to database.
* if you requested in the last 30 minute then it will show response code:409 conflict ."you have already placed a support ticket". 

## Task 2
Description: This problem statement is common in web application development, particularly in the context of user authentication and account activation. It ensures that users provide valid email addresses, verify their identity through activation, and only gain access to the system after completing the activation process.

### How to run the Task 2 project ? 
* Open the Task 2 folder with vscode.
* Install some dependencies which were used in Task 2 project. So go to the vscode bar -> Terminal -> New Terminal
* After New Terminal opens run the command : `npm install `. The dependencies will reinstall for your workspace.
* If this don't work then run this command `npm install bcrypt crypto express-session express jsonwebtoken body-parser mongoose nodemailer `
* Then run this command `npm install -D nodemon`. All the dependencies are installed now.
* Now run the command `npm start` . you will see Server is running at http://localhost:3000 DB is connected .
* Now go to browser URL type : http://localhost:3000/signup . It will redirect to signup page.
* Then fill up the Signup form ( with actual email) . Then submit. It will show "Activation mail is sent to your gmail. Go to your mail to activate "
* Now if open mongoDBcompass you will see in the database your data is stored. but it isverified is false. because you have not activated the mail.
* Then go to your mail account. you will see a mail was sent regarding the activation. Click the activation link. 
* After clicking now the activation is completed if you see the database isverified is true now . After that it will redirect you to Login page.
* Now if you login with your given mail and password you will see some text.      

   

