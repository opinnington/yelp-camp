var express  = require("express"),
    router   = express.Router(),
    passport = require("passport"),
    User     = require("../models/user");

//Landing page route
router.get("/", function(req, res){
    res.render("landing");
});

//=====================
//Authenticaiton Routes
//=====================

//Register form
router.get("/register", function(req, res){
   res.render("register"); 
});

router.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
       if(err){
           return res.render("register", {"error": err.message});
       } 
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to YelpCamp " + user.username);
           res.redirect("/campgrounds");
       });
   });
});

//Login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//Handling Login logic - Middleware to authenticate the user using LocalStrategy User.authenticate()
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
    
});

//Logout Route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = router;