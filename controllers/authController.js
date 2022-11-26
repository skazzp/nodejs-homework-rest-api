const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../service/schemas/users');

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const conflictCheck = await User.findOne({ email });

  if (conflictCheck) {
    return res.status(409).json({ message: 'Email in use' });
  }

  try {
    const user = new User({ email, password });

    await user.save();
    return res.status(201).json({
      data: {
        user: {
          email,
          subscription: user.subscription,
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

module.exports = { register, login, logout, currentUser };
