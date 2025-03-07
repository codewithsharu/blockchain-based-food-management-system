const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');
const Order = require('../models/Order');
const User = require('../models/User');

// Middleware to check if user is charity manager
const isCharityManager = (req, res, next) => {
    if (req.user && req.user.role === 'charity' && req.user.approved) {
        next();
    } else {
        req.flash('error_msg', 'Access denied. Approved charity manager only.');
        res.redirect('/');
    }
};

// Charity Dashboard
router.get('/dashboard', isCharityManager, async (req, res) => {
    try {
        const availableFood = await FoodItem.find({ quantity: { $gt: 0 } })
            .populate('restaurant');
        const myOrders = await Order.find({ charity: req.user._id })
            .populate('restaurant');
        res.render('charity/dashboard', {
            availableFood,
            myOrders
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Place Order
router.post('/order', isCharityManager, async (req, res) => {
    try {
        const { items, pickupAddress, pickupTime } = req.body;
        
        // Validate items
        for (const item of items) {
            const foodItem = await FoodItem.findById(item.foodItem);
            if (!foodItem || foodItem.quantity < item.quantity) {
                req.flash('error_msg', 'Insufficient quantity available for some items');
                return res.redirect('/charity/dashboard');
            }
        }

        // Get the restaurant ID from the first food item
        const firstFoodItem = await FoodItem.findById(items[0].foodItem);
        if (!firstFoodItem) {
            req.flash('error_msg', 'Invalid food item selected');
            return res.redirect('/charity/dashboard');
        }

        // Create order
        const order = new Order({
            charity: req.user._id,
            restaurant: firstFoodItem.restaurant,
            items,
            pickupAddress,
            pickupTime
        });

        await order.save();
        req.flash('success_msg', 'Order placed successfully');
        res.redirect('/charity/dashboard');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error creating order. Please try again.');
        res.redirect('/charity/dashboard');
    }
});

// Cancel Order
router.post('/order/cancel/:id', isCharityManager, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            charity: req.user._id,
            status: 'pending'
        });
        if (!order) {
            req.flash('error_msg', 'Order not found');
            return res.redirect('/charity/dashboard');
        }

        order.status = 'cancelled';
        await order.save();
        req.flash('success_msg', 'Order cancelled successfully');
        res.redirect('/charity/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 