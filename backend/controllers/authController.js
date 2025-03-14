// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { default: cloudinary } = require('../config/cloudinary');
require('dotenv').config();

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

const getUserName = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

const updateProfile = async (req, res) => {
  try {
    const {profilePic} = req.body;
    const userId = req.user._id

    if(!profilePic){
      return res.status(400).json({error: "Please upload a profile picture"})
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true})

    return res.status(200).json(updatedUser)
  } catch (error) {
    console.log("Error in the update profile", error)
    return res.status(500).json({message:"Internal Server Error"})
  }
}
module.exports = { register, login , getUserName, updateProfile};