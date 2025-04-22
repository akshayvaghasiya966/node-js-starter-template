const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const paginate = require('../utils/paginate');


// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create user
  const user = new User({ name, email, password });
  await user.save();

  res.status(201).json({ message: 'User registered successfully' });
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET, // use env
      { expiresIn: '1h' }
    );
    res.json({ token });
};


const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const role = req.query.role;
  const sortBy = req.query.sortBy || 'createdAt';
  const order = req.query.order === 'asc' ? 1 : -1;

  const filters = {};
  if (role) filters.role = role;

  const result = await paginate({
    model: User,
    page,
    limit,
    searchTerm: search,
    searchFields: ['name', 'email'],
    filters,
    sort: { [sortBy]: order }
  });

  res.status(200).json(result);
};


module.exports = { registerUser, loginUser, getAllUsers };