const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            generateToken(res, user._id);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id);

            // Create a "Welcome back" notification
            const Notification = require('../models/Notification');
            const welcomeNotif = await Notification.create({
                user: user._id,
                message: `Welcome back, ${user.name}!`,
                type: 'user_status'
            });

            // Socket.io broadcast
            const io = req.app.get('io');
            if (io) {
                io.emit('user_login', { userId: user._id, name: user.name });
                // Notify the user themselves to update their notification count
                io.to(user._id.toString()).emit('notification_received', welcomeNotif);
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
    const userId = req.user?._id;
    const name = req.user?.name;

    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    const io = req.app.get('io');
    if (io && userId) io.emit('user_logout', { userId, name });

    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            workspaces: user.workspaces
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('+password');

        if (user) {
            user.name = req.body.name || user.name;
            user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;

            if (req.body.email && req.body.email !== user.email) {
                const emailExists = await User.findOne({ email: req.body.email });
                if (emailExists) {
                    return res.status(400).json({ message: 'Email already in use by another account' });
                }
                user.email = req.body.email;
            }

            if (req.body.avatar !== undefined) {
                user.avatar = req.body.avatar;
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                bio: updatedUser.bio
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove avatar
// @route   DELETE /api/auth/profile/avatar
// @access  Private
const removeAvatar = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
            { new: true }
        );
        if (user) {
            res.json({ message: 'Avatar removed', avatar: user.avatar });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select('+password');

        if (user && (await user.matchPassword(currentPassword))) {
            user.password = newPassword;
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).json({ message: 'Invalid current password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper: Generate Token
const generateToken = (res, id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateProfile,
    removeAvatar,
    updatePassword
};
