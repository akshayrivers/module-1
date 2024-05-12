const express = require("express");
const app = express();
const port = 3000;
const knex = require('knex');

// Knex configuration for PostgreSQL
const pg = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '1720',
    database: 'postgres',
    ssl: false // Disable SSL for local development
  }
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Everyone!");
});

app.post("/signup", async (req, res) => {
  const { username, password, email, phone_number } = req.body;
  
  try {
    // Check if any user already exists with the provided username, email, or phone_number
    const existingUsers = await pg('users')
      .where('username', username)
      .orWhere('email', email)
      .orWhere('phone_number', phone_number)
      .select('username', 'email', 'phone_number');

    // Check if any existing user matches the provided values
    if (existingUsers.length > 0) {
      existingUsers.forEach(user => {
        if (user.username === username) {
          return res.status(400).send("Username already exists");
        }
        if (user.email === email) {
          return res.status(400).send("Email already exists");
        }
        if (user.phone_number === String(phone_number)) {
          return res.status(400).send("Phone number already exists");
        }
      });
    }

    // If no existing user matches, insert the new user into the database
    await pg.transaction(async (trx) => {
      await pg('users').transacting(trx).insert({
        username,
        password,
        email,
        phone_number
      });
    });

    res.send("User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
