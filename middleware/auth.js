const ensureAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error_msg', 'Please log in to access this page');
        return res.redirect('/auth/login');
    }
    
    // Check if user is approved
    if (!req.user.approved) {
        return res.redirect('/auth/pending-approval');
    }
    
    next();
};

const forwardAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (!req.user.approved) {
            return res.redirect('/auth/pending-approval');
        }
        return res.redirect('/dashboard');
    }
    next();
};

module.exports = {
    ensureAuthenticated,
    forwardAuthenticated
}; 