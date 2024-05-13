const pg = require("./database");
const {hashPassword, comparePasswords} = require("./hashing");
const express = require("express");

const app = express();
const port = 3000;



app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Everyone!");
});


//sign-up route
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
    const hashedPassword = await hashPassword(password);
    // If no existing user matches, insert the new user into the database
    await pg.transaction(async (trx) => {
      await pg('users').transacting(trx).insert({
        username,
        password: hashedPassword,
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

//login route 
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
 
  try {
    // Check if a user with the provided username exists
    const user = await pg('users')
      .where('username', username)
      .select('username', 'password')
      .first();

    if (!user) {
      return res.status(400).send("Invalid username or password");
    }

    const match = await comparePasswords(password, user.password);

    if (!match) {
      return res.status(400).send("Invalid username or password");
    }
    res.send("Login successful");
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Internal Server Error");
  }
}
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
