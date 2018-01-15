var Campground = require("../models/campground"),
    Comment    = require("../models/comment");

//Middleware goes here.
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
               if(err){
                   req.flash("error", "Something went wrong");
                   res.redirect("/campgrounds");
               } else {
                   if (!foundCampground) {
                        req.flash("error", "Item not found.");
                        return res.redirect("back");
                    }
                   if(foundCampground.author.id.equals(req.user._id) || req.user.username === "Oliver"){
                      next();
                   } else {
                       req.flash("error", "You do not have permission to do that");
                       res.redirect("back");
                   }
               } 
            });
        } else {
            req.flash("error", "You need to be logged in to do that");
            res.redirect("back");
        }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
               if(err){
                   req.flash("error", "Something went wrong");
                   res.redirect("/campgrounds");
               } else {
                   if (!foundComment) {
                        req.flash("error", "Item not found.");
                        return res.redirect("back");
                    }
                   if(foundComment.author.id.equals(req.user._id) || req.user.username === "Oliver"){
                      next();
                   } else {
                       req.flash("error", "You do not have permission to do that");
                       res.redirect("back");
                   }
               } 
            });
        } else {
            req.flash("error", "You need to be logged in to do that");
            res.redirect("back");
        }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login first");
    res.redirect("/login");
}
module.exports = middlewareObj;