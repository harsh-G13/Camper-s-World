const User = require('../models/user')

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}
module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', "Welcome to Camper's World!");
            res.redirect('/campgrounds');
        })
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }

}
module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}
module.exports.login =  (req, res) => {
    
    req.flash('success', 'Welcome back!')
    const redirecturl = (req.session.redirectTo) || '/campgrounds';
    delete req.session.redirectTo;
   
    res.redirect(redirecturl);
}

