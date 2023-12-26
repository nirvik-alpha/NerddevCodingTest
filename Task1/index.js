const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();
const PORT = 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));


///------------------mongoose schema create-----------------/////

const supportTicketSchema = new mongoose.Schema({
    userID: String,
    date: Date,
    deviceID: String,
    queryText: String,
});

///------------------create model of the mongoose------------------////

const Ticket = mongoose.model("Tickets", supportTicketSchema);

///------------------Database connection-----------------////

const connectDB = async () => {

    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/support_tickets');
        console.log("DB is connected");
    } catch (error) {
        console.log("DB is no not  connected");
        console.log(error.message);
        process.exit(1);
    }
}

////----------------- POST method -------------------------///

app.post("/support/create_ticket", async (req, res) => {
    try {
        const { userID, date, deviceID, queryText } = req.body;


        const lastRequest = await Ticket.findOne({ userID }, { sort: { date: -1 } });


        if (!lastRequest || (Date.now() - new Date(lastRequest.date).getTime() > 30 * 60 * 1000)) {
            // Save record in DB
            const result = await Ticket.insertOne({ userID, date, deviceID, queryText });


            // Send Response for Case 1( If the last request was more than 30 minutes ago )
            res.status(200).json({
                code: 200,
                data: { _id: result.insertedId.toString() }
            });
        } else {
            // Send Response for Case 2( If the last request was less or equal than 30 minutes ago)
            res.status(409).json({
                code: 409,
                data: { message: "You have already placed a support ticket. Please wait at least 30 minutes before sending another request" }
            });
        }


        // res.status(200).json({
        //    data: {
        //        _id: ticketData._id,
        //     },
        // });

        //res.status(201).send(ticketData);


    } catch (error) {
        res.send(500).send({ message: error.message });
    }
});




app.listen(PORT, async () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    await connectDB();
});