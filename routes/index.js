const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Home Page
router.get('/', (req, res) => {
    res.render('index');
});

// Dashboard Route
router.get('/dashboard', async (req, res) => {
    if (!req.user) {
        req.flash('error_msg', 'Please log in to view dashboard');
        return res.redirect('/auth/login');
    }

    if (!req.user.approved) {
        req.flash('error_msg', 'Your account is pending approval');
        return res.redirect('/');
    }

    switch (req.user.role) {
        case 'admin':
            res.redirect('/admin/dashboard');
            break;
        case 'restaurant':
            res.redirect('/restaurant/dashboard');
            break;
        case 'charity':
            res.redirect('/charity/dashboard');
            break;
        default:
            res.redirect('/');
    }
});

module.exports = router; 