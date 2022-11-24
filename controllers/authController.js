const { registerUser } = require('../service/auth');
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

module.exports = { register };
