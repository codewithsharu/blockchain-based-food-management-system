const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'restaurant', 'charity'],
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: function() {
            return this.role !== 'admin';
        }
    },
    address: {
        type: String,
        required: function() {
            return this.role === 'charity';
        }
    },
    restaurantName: {
        type: String,
        required: function() {
            return this.role === 'restaurant';
        }
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        console.error('Password comparison error:', err);
        return false;
    }
};

// Drop any existing indexes
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema); 