const { prismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new prismaClient();

//async functions
// registration of a new user
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } }); //checking if the email is already in use
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "error", message: "Email already in use" });
    }
    // email is unique hashing of password takes place
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create the user and store in the DB
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role, // If this is undefined, Prisma automatically  inserts VIEWER as it is the default value
      },
    });
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// login process
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //finding user by email
    const user = prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "Email Address Not Found." });
    }
    //Check if account is active
    if (!user.isActive) {
      return res
        .status(403)
        .json({ status: "error", message: "Account is deactivated" });
    }
    // Compare the provided password with the hashed password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid Password" });
    }
    //Generating JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role }, //embedding user's id and role in the token
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }, //ttl of the token
    );
    res.status(200).json({
      status: "success",
      message: "user logged in succesfully",
      token, //token is sent to the user
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
module.exports = { register, login };
