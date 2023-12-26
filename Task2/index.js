
const express = require("express");
const mongoose = require('mongoose');
const cookieparser = require('cookie-parser');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

//const jwt = require('jsonwebtoken');
//const cookie = require('cookie-parser');

/*
const createToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET);
}
*/

const app = express();
const PORT = 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
//app.use(cookieparser)

///----------------------------- Created Mongoose Schema -----------------/// 

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    emailToken: {
        type: String,

    },
    isVerified: {
        type: Boolean,

    },
    date: {
        type: Date,

    }

});

/////------------------------ Created model ----------------------////

const User = mongoose.model("UserDetails", userSchema);

const connectDB = async () => {

    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/userDetailDB');
        console.log("DB is connected");
    } catch (error) {
        console.log("DB is no not  connected");
        console.log(error.message);
        process.exit(1);
    }
}

////-------------------------------------Mail sender details---------------------////

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sadidrafan094@gmail.com',
        pass: 'jbro lwvr kwma wuyj'
    },
    tls: {
        rejectUnauthorized: false
    }


})

/////---------------------- Verify Email ----------------------------/////

app.get("/verify-email", async (req, res) => {

    try {
        const token = req.query.token;
        const user = await User.findOne({ emailToken: token })

        if (user) {
            user.emailToken = null
            user.isVerified = true
            await user.save()
            console.log("verified")
            res.redirect('/login')
        }
        else {
            res.redirect('/signup')
            console.log("Email is not verified")
        }

    } catch (err) {
        console.log(err)
    }

});

////------------------------------ Sign Up --------------------------------///

///-----------------------------Sign Up GET method -----------------------------////

app.get("/signup", (req, res) => {

    res.sendFile(__dirname + "/index.html");

});

///---------------------------- Sign Up POST method ----------------------------///

app.post("/signup", async (req, res) => {
    try {

        const newUser = new User({
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            mobile: req.body.mobile,
            password: req.body.password,
            emailToken: crypto.randomBytes(64).toString('hex'),
            isVerified: false
        });

        /// ------------------------------For hashing the password-------------------////
        const salt = await bcrypt.genSalt(10)
        const hashPassowrd = await bcrypt.hash(newUser.password, salt)
        newUser.password = hashPassowrd

        const userData = await newUser.save();

        ////////------------------ Send verification mail to user -------------------//////

        var mailOptions = {
            from: ' "Sadid Rafan" <sadidrafan094@gmail.com> ',
            to: newUser.email,
            subject: 'Activate your mail',
            html: `<h2> ${newUser.firstname}! Thanks for Registering On Our Site.
            we highly recommend you to activate your email now to enhance the security 
            of your account and prevent unauthorized access.
            </h2>
            <h3> Please Activate your mail to continue. Click the Given Activation Link !  </h3>
            <a href="http://${req.headers.host}/verify-email?token=${newUser.emailToken}">Activate Your Email</a>`
        }

        ////////---------------- Sending mail-----------------------////// 

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            }
            else {
                console.log("Verification mail is sent to your gmail");
            }
        })

        res.send("Activation mail is sent to your gmail. Go to your mail to activate ");
        console.log(req.body.email);
        console.log(req.body.password);

        //res.status(201).send(userData);
        // res.redirect('signup_success.html');


    } catch (error) {
        res.send(500).send({ message: error.message });
    }
});

/////------------------------------------- Login Part----------------------------//////

////------------------------Login GET method-----------------------///

app.get("/login", (req, res) => {

    res.sendFile(__dirname + "/login.html");    /// will go to login page 

});

/////------------------ Login POST method -------------------------////
app.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;
        const findUser = await User.findOne({ email: email })

        if (findUser) {
            const match = await bcrypt.compare(password, findUser.password);
            if (match) {

                // this will show some text
                res.send("hello , hi ! how are you ?");
            }
            else {
                console.log("Invalid password")
            }
        }
        else {
            console.log("User not registered..")
        }

    } catch (error) {
        res.send(500).send({ message: error.message });
    }
});



/*
const loginrequired = async (req, res, next) => {
    const token = req.cookie['access-token']

    if (token) {
        const validation = await jwt.verify(token, JWT_SECRET)
        if (validation) {
            res.user = validation.id;
            next()

        }
        else {
            console.log("token expires");
        }
    }
    else {
        console.log("token not found");
    }

}

*/

/// listening port 

app.listen(PORT, async () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    await connectDB();
});


