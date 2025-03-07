require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const app = express();

// Passport Config
require('./config/passport')(passport);

// MongoDB Connection
mongoose.connect('mongodb+srv://temp:Fgouter55%23@cluster0.bblcm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('MongoDB Connected');
    
    // Create default admin user if it doesn't exist
    try {
        // First, drop any existing indexes
        await User.collection.dropIndexes();
        
        const adminExists = await User.findOne({ email: 'admin@foodsystem.com' });
        if (!adminExists) {
            // Create admin user with plain password (will be hashed by pre-save hook)
            const adminUser = new User({
                name: 'Admin',
                email: 'admin@foodsystem.com',
                password: 'admin123',
                role: 'admin',
                approved: true
            });
            
            await adminUser.save();
            console.log('Default admin user created');
        } else {
            console.log('Admin user already exists');
        }
    } catch (err) {
        console.error('Error creating admin user:', err);
    }
})
.catch(err => console.log('MongoDB Connection Error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View Engine Setup
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

// Session setup
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user;
    next();
});

// Redirect root to appropriate login
app.get('/', (req, res) => {
    if (req.user) {
        if (!req.user.approved) {
            return res.redirect('/auth/pending-approval');
        }
        if (req.user.role === 'admin') {
            return res.redirect('/admin/dashboard');
        } else if (req.user.role === 'restaurant') {
            return res.redirect('/restaurant/dashboard');
        } else if (req.user.role === 'charity') {
            return res.redirect('/charity/dashboard');
        }
    }
    res.render('index');
});

// Dashboard route
app.get('/dashboard', (req, res) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    
    if (!req.user.approved) {
        return res.redirect('/auth/pending-approval');
    }
    
    switch (req.user.role) {
        case 'admin':
            return res.redirect('/admin/dashboard');
        case 'restaurant':
            return res.redirect('/restaurant/dashboard');
        case 'charity':
            return res.redirect('/charity/dashboard');
        default:
            return res.redirect('/auth/login');
    }
});

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/restaurant', require('./routes/restaurant'));
app.use('/charity', require('./routes/charity'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});