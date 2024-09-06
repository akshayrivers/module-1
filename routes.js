// const pg = require("./database");
// const express = require("express");
// const QRCode = require("qrcode");
// const nodemailer = require("nodemailer");

// const app = express();
// const port = 3000;
// const appPassword = 'vcqphtovbhowvvfo';
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Hello Everyone!");
// });
// //schedule
//     app.get("/schedule", async (req, res) => {
//       try {
//         // Query to fetch event_name, event_id, start_time, end_time, and event_day
//         const scheduleData = await pg('eventdescription1')
//           .select('event_name', 'event_id', 'start_time', 'end_time', 'event_day');
        
//         // Send the data as a JSON response
//         res.json(scheduleData);
//       } catch (error) {
//         console.error("Error fetching schedule data:", error);
//         res.status(500).send("Internal Server Error");
//       }
//     });
// //registration
// app.get("/eventRegistrationDetails", async (req, res) => {
//   try {
//     // Query to fetch event_name, event_id, nit_entry_fee, and outside_entry_fee
//     const registrationDetails = await pg('eventdescription1')
//       .select('event_name', 'event_id', 'nit_entry_fee', 'outside_entry_fee');
    
//     // Send the data as a JSON response
//     res.json(registrationDetails);
//   } catch (error) {
//     console.error("Error fetching registration details:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });
// //card
// app.get("/card", async (req, res) => {
//   try {
//     // Query to fetch cardimage, event_id, start_time, end_time, event_name, and event_day
//     const cardData = await pg('eventdescription1')
//       .select('cardimage', 'event_id', 'start_time', 'end_time', 'event_name', 'event_day');
    
//     // Send the data as a JSON response
//     res.json(cardData);
//   } catch (error) {
//     console.error("Error fetching card data:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });
// // Registration route
// app.post("/register", async (req, res) => {
//   const { username, email, phone_number, payment, event_ids } = req.body;
//   const userid = Math.floor(1000000000 + Math.random() * 9000000000).toString();

//   try {
//     // Check if the email already exists
//     const existingUser = await pg('UserRegistration').where({ email }).first();

//     if (existingUser) {
//       return res.status(400).json({ error: "Email already registered" });
//     }

//     // Insert the new user into the database
//     await pg('UserRegistration').insert({
//       userid,
//       username,
//       email,
//       phone_number,
//       payment,
//       created_at: new Date()
//     });

//     // Insert the user's event preferences
//     const userEvents = event_ids.map(event_id => ({
//       user_id: userid,
//       event_id,
//       created_at: new Date()
//     }));


//     await pg('UserEvents').insert(userEvents);

//     // If payment is complete, generate and send the QR code
//     if (payment) {
//       const qrCodeData = `UserID: ${userid}\nUsername: ${username}\nEmail: ${email}`;
//       const qrCodeUrl = await QRCode.toDataURL(qrCodeData);

//       let transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: 'zingping692@gmail.com',
//           pass: appPassword
//         }
//       });

//       await transporter.sendMail({
//         from: '"Techvaganza" <zingping692@gmail.com>',
//         to: email,
//         subject: "Your QR Code",
//         text: "Thank you for your payment. Please find your QR code attached.",
//         attachments: [{
//           filename: 'qrcode.png',
//           content: qrCodeUrl.split("base64,")[1],
//           encoding: 'base64'
//         }]
//       });
//     }

//     res.json({ message: "User data and preferences registered successfully" });
//   } catch (error) {
//     console.error("Error registering user data:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });
// //endpoint to get everything
// app.get("/everything", async (req, res) => {
//   try {
//     // Fetch all data from eventdescription1
//     const eventData = await pg('eventdescription1').select('*');
    
//     // Send the data to the frontend
//     res.json(eventData);
//   } catch (error) {
//     console.error("Error fetching event data:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// //event description
// // Endpoint to get details about a specific event
// app.get("/event/:event_id", async (req, res) => {
//   const { event_id } = req.params;

//   try {
//     // Query the database to fetch details for the specified event_id
//     const eventData = await pg('eventdescription1') // Replace 'events' with your actual table name
//       .where({ event_id })
//       .first(); // Use .first() to get a single record

//     // Check if eventData is null (i.e., no event found with the provided ID)
//     if (!eventData) {
//       return res.status(404).json({ error: "Event not found" });
//     }

//     // Send the event data as a JSON response
//     res.json(eventData);
//   } catch (error) {
//     console.error("Error fetching event details:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });


// // Endpoint to get user preferences
// // app.get("/userPreferences/:user_id", async (req, res) => {
// //   const { user_id } = req.params;

// //   try {
// //     const preferences = await pg('UserEvents')
// //       .join('Events', 'UserEvents.event_id', 'Events.event_id')
// //       .select('Events.event_id', 'Events.event_name', 'Events.event_date', 'Events.location', 'Events.description')
// //       .where('UserEvents.user_id', user_id);

// //     res.json(preferences);
// //   } catch (error) {
// //     console.error("Error fetching user preferences:", error);
// //     res.status(500).send("Internal Server Error");
// //   }
// // });

// app.post("/registerUserAndEvents", async (req, res) => {
//   const { firstname, lastname, email, contact, nit, extradetails, address, event_ids } = req.body;
  
//   try {
//     // Check if the user already exists
//     const existingUser = await pg('users').where({ email }).first();

//     if (existingUser) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     // Insert user into the users table
//     const [newUser] = await pg('users').insert({
//       firstname,
//       lastname,
//       email,
//       contact,
//       nit,
//       extradetails,
//       address
//     }).returning('user_id');  // 'returning' is used to get the inserted user's ID
//     // Map user to events in user_events table
//     const user_id = newUser.user_id;
//     const userEvents = event_ids.map(event_id => ({
//       user_id,
//       event_id,
//       registration_date: new Date()
//     }));

//     // Insert the user-event mapping into user_events table
//     await pg('user_events').insert(userEvents);

//     res.json({ message: "User and event registration successful!" });
//   } catch (error) {
//     console.error("Error registering user and events:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });



// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });



// NEW CODE HERE









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

// schedule
app.get("/schedule", async (req, res) => {
  try {
    const scheduleData = await pg('eventdescription1')
      .select('event_name', 'event_id', 'start_time', 'end_time', 'event_day');
    res.json(scheduleData);
  } catch (error) {
    console.error("Error fetching schedule data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// registration
app.get("/eventRegistrationDetails", async (req, res) => {
  try {
    const registrationDetails = await pg('eventdescription1')
      .select('event_name', 'event_id', 'nit_entry_fee', 'outside_entry_fee');
    res.json(registrationDetails);
  } catch (error) {
    console.error("Error fetching registration details:", error);
    res.status(500).send("Internal Server Error");
  }
});

// card
app.get("/card", async (req, res) => {
  try {
    const cardData = await pg('eventdescription1')
      .select('cardimage', 'event_id', 'start_time', 'end_time', 'event_name', 'event_day');
    res.json(cardData);
  } catch (error) {
    console.error("Error fetching card data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to register user and events and send QR code
app.post("/registerUserAndEvents", async (req, res) => {
  const { firstname, lastname, email, contact, nit, extradetails, address, event_ids } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await pg('users').where({ email }).first();

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Insert user into the users table
    const [newUser] = await pg('users').insert({
      firstname,
      lastname,
      email,
      contact,
      nit,
      extradetails,
      address
    }).returning('user_id');  // Get the inserted user's ID

    const user_id = newUser.user_id;  // Extract user_id

    // Map user to events in user_events table
    const userEvents = event_ids.map(event_id => ({
      user_id,
      event_id,
      registration_date: new Date()
    }));

    // Insert the user-event mapping into user_events table
    await pg('user_events').insert(userEvents);

    // Generate QR code data with user_id
    const qrCodeData = `${user_id}`;
    const qrCodeUrl = await QRCode.toDataURL(qrCodeData);

    // Send the QR code via email
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
      subject: "Your Event Registration QR Code",
      text: `Thank you for registering. Please find your QR code attached. User ID: ${user_id}`,
      attachments: [{
        filename: 'qrcode.png',
        content: qrCodeUrl.split("base64,")[1],
        encoding: 'base64'
      }]
    });

    res.json({ message: "User and event registration successful! QR code sent to email." });
  } catch (error) {
    console.error("Error registering user and events:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
