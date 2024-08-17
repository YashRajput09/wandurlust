const User = require("../models/user.js");
const crypto = require('crypto');
const nodemailer = require('nodemailer');

module.exports.signUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signUpUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    let registeredUser = await User.register(newUser, password);
    //   console.log(registeredUser);
    req.login(registeredUser, (err) => {
      // when user signUp then it will be  called automatically by passport
      if (err) {
        //that user login automatically
        return next(err);
      }
      req.flash("success", "Registered successfully, Welcome to WanderLust !");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.logInForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.logInUser = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");
  // res.redirect("/listings");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logOutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out");
    res.redirect("/listings");
  });
};

module.exports.renderForgotPasswordForm = (req, res, next)=>{
  res.render('users/forgotPassword.ejs');
}; 

module.exports.forgotPassword = async(req, res, next) =>{
  crypto.randomBytes(20, (err, buf) =>{ //generate 20byte binary randomcode, which is stored in buf(Buffer)
    if (err) return next(err);

    const token = buf.toString('hex'); //convert randomcode to redable hexadecimal string
    
    const email  = req.body.email;
    User.findOne({ email: email })
        .then( user =>{
          if(!user){
            req.flash("error", `No account exists with ${email}`);
            return res.redirect('forgotPassword');
          }

          user.resetPasswordToken = token; //save token to db
          user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; //1 hour  //save token expire time

          user.save()
            .then(()=>{

            const transporter = nodemailer.createTransport({ // This method configures and returns a transport object that is used to send emails.
              // service: 'Gamil',
              host: 'smtp.gmail.com',
              port: 587,
              secure: false, 
              auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.APP_PASSWORD
              }
            });

            const mailOptions = { //mailOptions, which is used to configure the email that will be sent to the user when they request a password reset.
              to: user.email,
              from: 'rajputyash8561@gmail.com',
              subject: 'Reset Password',
              text: `Please click on the following link, or past this into your brower to compelete the forgot password process: \n\n` +
                    `http://${req.headers.host}/user/resetPassword/${token} \n\n` +
                    `If you are not request this, please ignore this email and your password will remain unchange. \n`
            };

             transporter.sendMail(mailOptions, err =>{ //sent a mail to user 
              if (err) return next(err);
              req.flash('info', `An email has been sent to ${user.email} with further instructions.`);
              res.redirect('login') 
            });
          })//

        }).catch(err =>{
          console.error("Error: ", err);
          next(err);
        });    
    
  })
}

module.exports.renderResetPasswordForm = (req, res, next) =>{
  User.findOne({ resetPasswordToken: req.params.token , resetPasswordExpires: { $gt: Date.now() }})
    .then( user => {
      if(!user){
        req.flash("error", "Password reset token is invalid or has expired.");
        return res.redirect('forgotPassword');
      }
      res.render('users/resetPassword.ejs', { token: req.params.token })
    })
    .catch((err =>{
      console.log(err);
      next(err);
    }))
}

module.exports.resetPassword = (req, res, next) =>{
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
    .then( user =>{
      if (!user){
        req.flash("error", "Password reset token is invalid or has expired.");
        return res.redirect('forgotPassword');
      }

      if (req.body.password === req.body.confirm){
        user.setPassword(req.body.password, err =>{

          if(err) return next(err);
          
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save()
            .then( user =>{
              if (err) return next(err);
              req.login(user, err =>{
                if (err) return next(err);
                req.flash("success", "Your password has been changed.")
                res.redirect('/');
              });
            })
            .catch(err =>{
              return next(err);
            });
        });
      }
      else{
        req.flash("error", "Password dost not match.");
        res.redirect('back')
      }
    });
};