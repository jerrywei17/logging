const User = require('../models/user');
exports.showSignup = function(req, res, msg) {
    res.render('signup', {
        title: '註冊頁面',
        message: msg
    });
};

exports.showSignin = function(req, res, msg) {
    res.render('signin', {
        title: '登入頁面',
        message: msg
    });
};
exports.signup = function(req, res) {
    var _user = {};
    _user.name = req.body.name;
    _user.password = req.body.password;
    User.findOne({
        name: _user.name
    }, function(err, user) {
        if (err) {
            console.log(err);
        }
        if (user) {
            return res.redirect('/signin');
        } else {
            var user = new User(_user);
            user.save(function(err, user) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/');
            });
        }
    });
};

exports.signin = function(req, res) {
    var _user = {};
    _user.name = req.body.name;
    _user.password = req.body.password;
    console.log('user name:' + _user.name);
    console.log('user password:' + _user.password);
    User.findOne({
        name: _user.name
    }, function(err, user) {
        if (err) {
            console.log(err);
        }
        if (!user) {
            return res.redirect('/signup');
        } else {
            user.comparePassword(_user.password, function(err, isMatch) {
                if (err) {
                    console.log(err);
                }
                if (isMatch) {
                    console.log('isMatch');
                    req.session.user = user;
                    return res.redirect('/');
                } else {
                    return res.redirect('/signin');
                }
            });
        }
    });
};

exports.logout = function(req, res) {
    delete req.session.user
    res.redirect('/');
};

exports.list = function(req, res) {
    User.fetch(function(err, users) {
        if (err) {
            console.log(err);
        }
        res.render('userlist', {
            title: '聊天室會員列表頁',
            users: users
        })
    });
};

//midware for user
exports.signRequired = function(req, res, next) {
    var user = req.session.user;

    if (!user) {
        return res.redirect('/signin');
    }

    next();
};

//midware for admin
exports.adminRequired = function(req, res, next) {
    var user = req.session.user;

    if (user.role <= 10) {
        return res.redirect('/signin');
    }

    next();
};

exports.validateName = function(req, res) {
    var name = req.body.name;
    User.findOne({
        name: name
    }, function(err, user) {
        if (err) {
            console.log(err);
        }
        console.log(user);
        if (!user) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ isExist: false }));
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ isExist: true }));
        }
    });
}