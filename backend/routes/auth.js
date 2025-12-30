const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send("A token is required for authentication");

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Register User
router.post('/signup', async (req, res) => {
    try {
        const { email, password, role, displayName } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            email,
            password: hashedPassword,
            displayName: displayName || email.split('@')[0],
            role: role || 'student'
        });

        await user.save();

        // Create Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '3d' }
        );

        res.json({ token, user: { ...user._doc, password: undefined } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password (only if user has one - handling old Google-only users)
        if (!user.password) {
            return res.status(400).json({ message: 'Please login with Google' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '3d' }
        );

        res.json({ token, user: { ...user._doc, password: undefined } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Auth with Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Callback route for Google
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login/failed', session: false }),
    (req, res) => {
        // Determine redirect URL based on environment
        const CLIENT_URL = process.env.FRONTEND_URL || 'http://localhost:8080';
        console.log("Redirecting to:", CLIENT_URL);

        // Create JWT
        const token = jwt.sign(
            { id: req.user._id, role: req.user.role },
            process.env.JWT_SECRET,
            { expiresIn: '3d' }
        );

        // Redirect to frontend with token
        res.redirect(`${CLIENT_URL}/auth/success?token=${token}`);
    }
);

router.get('/login/failed', (req, res) => {
    res.status(401).json({
        success: false,
        message: 'user failed to authenticate.'
    });
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(process.env.FRONTEND_URL);
});

module.exports = router;
