const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
dotenv.config();
let fromPhoneNumber = process.env.FROM_PHONE_NUMBER;
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

app.use(bodyParser.json());

app.post("/send-sms", (req, res) => {
  const { phoneNumbers, message } = req.body;

  if (!phoneNumbers || !message) {
    return res
      .status(400)
      .json({ error: "Phone numbers and message are required." });
  }

  const promises = phoneNumbers.map((phoneNumber) => {
    return client.messages.create({
      body: message,
      to: phoneNumber,
      from: fromPhoneNumber,
    });
  });

  Promise.all(promises)
    .then((messages) => {
      console.log("SMS messages sent successfully:", messages);
      res.json({ success: "SMS messages sent successfully" });
    })
    .catch((error) => {
      console.error("Error sending SMS messages:", error);
      res.status(500).json({ error: "Failed to send SMS messages" });
    });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
