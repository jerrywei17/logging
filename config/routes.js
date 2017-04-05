const Index = require('../app/controllers/index');
const User = require('../app/controllers/user');
const Room = require('../app/controllers/room');

module.exports = function(app) {
    //pre handle user
    app.use(function(req, res, next) {
        var _user = req.session.user;
        app.locals.user = _user;
        return next();
    });
    //Index
    app.get('/', Index.index);

    //User	    
    app.post('/user/signin', User.signin);
    app.post('/user/signup', User.signup);
    app.get('/signin', User.showSignin);
    app.get('/signup', User.showSignup);
    app.get('/logout', User.logout);
    app.post('/validateName', User.validateName);

    //Room	
    app.get('/room', User.signRequired, Room.enter);

}