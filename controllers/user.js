const User = require("../models/user.js");

module.exports.renderRegister = (req, res) => {
  res.render("./users/register.ejs");
};

module.exports.renderLogin = (req, res) => {
  res.render("./users/login.ejs");
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email: email, username: username });
    const newUser = await User.register(user, password);
    req.login(newUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to PrettyGoodRestaurants!");
      res.redirect("/restaurants");
    });
  } catch (e) {
    console.log(e);
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = req.session.returnTo || "/restaurants";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/restaurants");
};
