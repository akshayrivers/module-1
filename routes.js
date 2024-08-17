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
  const { username, email, phone_number, payment, event_ids } = req.body;
  const userid = Math.floor(1000000000 + Math.random() * 9000000000).toString();

  try {
    // Check if the email already exists
    const existingUser = await pg('UserRegistration').where({ email }).first();

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Insert the new user into the database
    await pg('UserRegistration').insert({
      userid,
      username,
      email,
      phone_number,
      payment,
      created_at: new Date()
    });

    // Insert the user's event preferences
    const userEvents = event_ids.map(event_id => ({
      user_id: userid,
      event_id,
      created_at: new Date()
    }));

    await pg('UserEvents').insert(userEvents);

    // If payment is complete, generate and send the QR code
    if (payment) {
      const qrCodeData = `UserID: ${userid}\nUsername: ${username}\nEmail: ${email}`;
      const qrCodeUrl = await QRCode.toDataURL(qrCodeData);

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'zingping692@gmail.com',
          pass: appPassword
        }
      });

      await transporter.sendMail({
        from: '"Techvaganza" <zingping692@gmail.com>',
        to: email,
        subject: "Your QR Code",
        text: "Thank you for your payment. Please find your QR code attached.",
        attachments: [{
          filename: 'qrcode.png',
          content: qrCodeUrl.split("base64,")[1],
          encoding: 'base64'
        }]
      });
    }

    res.json({ message: "User data and preferences registered successfully" });
  } catch (error) {
    console.error("Error registering user data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to get user preferences
app.get("/userPreferences/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const preferences = await pg('UserEvents')
      .join('Events', 'UserEvents.event_id', 'Events.event_id')
      .select('Events.event_id', 'Events.event_name', 'Events.event_date', 'Events.location', 'Events.description')
      .where('UserEvents.user_id', user_id);

    res.json(preferences);
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
