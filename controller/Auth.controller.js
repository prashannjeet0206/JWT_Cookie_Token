const authModel = require("../models/Auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Signup Controller
const signUp = async (req, res) => {
  try {
    const { name, password, email, role } = req.body;
    const userExists = await authModel.findOne({ email });

    if (userExists) {
      return res
        .status(401)
        .json({ success: false, message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const saveUser = await authModel.create({
      name,
      password: hashPassword,
      email,
      role,
    });
    return res
      .status(201)
      .json({ success: true, message: "User Created", data: saveUser });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", data: error });
  }
};

// Login Setup
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation if data is present in the field
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Fill All the fields" });
    }
    // Checking if user is Registered or not using email
    let isUser = await authModel.findOne({ email });
    if (!isUser) {
      return res
        .status(401)
        .json({ success: false, message: "User Not Registered" });
    }

    const payload = {
      email: isUser.email,
      id: isUser._id,
      role: isUser.role,
    };

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    };

    const checkPassword = await bcrypt.compare(password, isUser.password);
    if (!checkPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong Password" });
    } else {
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      isUser = isUser.toObject();
      isUser.token = token;
      isUser.password = undefined;

      return res.cookie("token", token, options).status(200).json({
        success: true,
        message: "User Logged-in",
        token,
        data: isUser,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { signUp, Login };
