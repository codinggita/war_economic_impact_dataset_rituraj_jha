const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret', {
    expiresIn: '30d',
  });
};

exports.googleAuth = async (req, res) => {
  try {
    const { credential, access_token } = req.body;
    let email, name, picture, googleId;

    if (credential) {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      ({ sub: googleId, email, name, picture } = payload);
    } else if (access_token) {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user info from Google');
      }
      const userInfo = await response.json();
      ({ sub: googleId, email, name, picture } = userInfo);
    } else {
      return res.status(400).json({ message: 'Google credential or access token is required' });
    }

    // Check if user already exists
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // If user exists by email but no googleId, link them
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = picture || user.avatar;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        username: name.replace(/\s+/g, '_').toLowerCase() + '_' + Date.now().toString(36),
        email,
        googleId,
        avatar: picture || '',
      });
    }

    res.status(200).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ username, email, password: hashedPassword });
    if (user) {
      res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

exports.forgotPassword = (req, res) => {
  res.status(200).json({ message: 'Password reset link sent to email' });
};

exports.resetPassword = (req, res) => {
  res.status(200).json({ message: 'Password has been reset' });
};

exports.refreshToken = (req, res) => {
  res.status(200).json({ token: generateToken(req.user.id) });
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, avatar, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update username
    if (username) user.username = username;
    
    // Update avatar
    if (avatar) user.avatar = avatar;

    // Update password if provided
    if (newPassword) {
      // If user has a password (not just Google Auth) they must provide currentPassword
      if (user.password && !currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password' });
      }
      
      if (user.password) {
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid current password' });
        }
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res.status(200).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
