module.exports = {
    ensureAuthenticated: ( req, res, next) => {
        if(!req.isAuthenticated()) {
            req.flash('error_msg', 'You are not Logged in');
            res.redirect('/login');
        }
        return next();
    },
    
    LoginAuthenticated: ( req, res, next) => {
        if(req.isAuthenticated()) {
            res.send('/');    
        }
        //req.flash('error_msg', 'You are already Logged in');
        return next();
    },
    'facebookAuth' : {
        'clientID'      : '171817297537255', // your App ID
        'clientSecret'  : 'a845536676ac0ceaea61e309a960afce', // your App Secret
        'callbackURL'   : 'http://localhost:2727/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['emails', 'first_name', 'last_name'] // For requesting permissions from Facebook API
    },
}