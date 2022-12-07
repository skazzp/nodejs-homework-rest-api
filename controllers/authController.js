const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const { v4: uuidv4 } = require('uuid');
const sendVerificationMail = require('../service/sendMail');
const User = require('../service/schemas/users');
require('dotenv').config();

const register = async (req, res, next) => {
  const { email, password, subscription } = req.body;
  const conflictCheck = await User.findOne({ email });

  if (conflictCheck) {
    return res.status(409).json({ message: 'Email in use' });
  }

  const secureUrl = gravatar.url(email, { s: '100', r: 'x', d: 'retro' }, true);
  const verificationToken = uuidv4();

  try {
    const user = new User({
      email,
      password,
      subscription,
      avatarURL: secureUrl,
      verificationToken,
    });
    await user.save();
    sendVerificationMail(email, verificationToken);
    return res.status(201).json({
      data: {
        user: {
          email,
          subscription: user.subscription,
          avatarURL: secureUrl,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: 'Email or password is wrong' });
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Email or password is wrong' });
  }
  if (!user.verify) {
    return res.status(401).json({ message: 'Email not verified' });
  }
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  await User.findByIdAndUpdate({ _id: user._id }, { $set: { token } });
  return res.status(200).json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    return res.status(401).json({ message: 'Email or password is wrong' });
  }
  await User.findByIdAndUpdate({ _id: req.user._id }, { $set: { token: null } });
  return res.status(204).json();
};

const currentUser = async (req, res, next) => {
  const user = await User.findById({ _id: req.user._id });
  return res.status(200).json({ email: user.email, subscription: user.subscription });
};

const changeAvatar = async (req, res, next) => {
  const avatarURL = req.file.path;
  await User.findByIdAndUpdate({ _id: req.user._id }, { avatarURL });
  return res.status(200).json({ avatarURL });
};

const verifyUser = async (req, res, next) => {
  const verificationToken = req.params.verificationToken;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  await User.findByIdAndUpdate(
    { _id: user._id },
    { $set: { verificationToken: null, verify: true } }
  );
  return res.status(200).json({ message: 'Verification successful' });
};

const verificationRetry = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Missing required field email' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Email or password is wrong' });
  }
  const { verify } = user;
  if (verify) {
    return res.status(401).json({ message: 'Verification has already been passed' });
  }
  sendVerificationMail(email, user.verificationToken);
  return res.status(200).json({ message: 'Verification email sent' });
};

module.exports = {
  register,
  login,
  logout,
  currentUser,
  changeAvatar,
  verifyUser,
  verificationRetry,
};
