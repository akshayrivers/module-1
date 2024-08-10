const pg = require("./database");
const express = require("express");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");

const app = express();
const port = 3000;
const appPassword = 'vcqphtovbhowvvfo';
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Everyone!");
});

// Registration route
app.post("/register", async (req, res) => {
  const { username, email, phone_number, payment } = req.body;
  const userid = Math.floor(1000000000 + Math.random() * 9000000000).toString();

  try {
    // Insert the provided data into the database
    await pg('user1').insert({
      userid,
      username,
      email,
      phone_number,
      payment,
      created_at: new Date() // Automatically set the current timestamp
    });

    // If payment is complete, generate and send the QR code
    if (payment) {
      // Generate the QR code with user info
      const qrCodeData = `UserID: ${userid}\nUsername: ${username}\nEmail: ${email}`;
      const qrCodeUrl = await QRCode.toDataURL(qrCodeData);

      // Set up Nodemailer transporter (configure with your email provider)
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'zingping692@gmail.com', // Replace with your email
          pass: appPassword   // Replace with your email password
        }
      });

      // Send email with QR code
      let info = await transporter.sendMail({
        from: '"Techvaganza" <zingping692@gmail.com>', // Replace with your app's name and email
        to: email, // Send the email to the user's email address
        subject: "Your QR Code",
        text: "Thank you for your payment. Please find your QR code attached... Testing the mailing and QR code generation.. Reply if you receive this mail.",
        attachments: [{
          filename: 'qrcode.png',
          content: qrCodeUrl.split("base64,")[1],
          encoding: 'base64'
        }]
      });

      console.log("QR Code sent: %s", info.messageId);
    }

    res.send("User data registered successfully");
  } catch (error) {
    console.error("Error registering user data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
