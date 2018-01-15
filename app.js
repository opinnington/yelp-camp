var express       = require("express"),
    app           = express(),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    flash         = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    bodyParser    = require("body-parser"),
    methodOverride = require("method-override"),
    User          = require("./models/user");


//Requiring Routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
    

mongoose.connect(process.env.DATABASEURL, {useMongoClient: true});

mongoose.Promise = global.Promise; 
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(flash());



//Passport Configuration
app.use(require("express-session")({
    secret: "Honey is the cutest cat",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware to check if a user is logged in
app.use(function(req, res, next){
   res.locals.currentUser = req.user; 
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started...");
});