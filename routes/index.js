var express = require("express");
var router = express.Router();
const User = require("./users");
const passport = require("passport");
const localStrategy = require("passport-local");

passport.use(new localStrategy(User.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { error: req.flash("error") });
});

router.get("/profile", isLoggedIn, function (req, res) {
  res.render("profile");
});

router.post("/register", function (req, res) {
  var userdata = new User({
    username: req.body.username,
    secret: req.body.secret,
  });

  User.register(userdata, req.body.password, function (err, registeredUser) {
    if (err) {
      console.error(err);

      // Check for specific registration error and provide a custom error message
      if (err.name === "UserExistsError") {
        req.flash("error", "User with this email already exists.");
      } else {
        req.flash("error", "Registration failed. Please try again.");
      }

      return res.redirect("/register");
    }

    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.get("/login", (req, res) => {
  res.render("login", { error: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("error", "Invalid username or password");
    res.redirect("/login");
  }
);
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;
