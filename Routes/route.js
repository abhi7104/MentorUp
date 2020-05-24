// const express = require('express');
// const app = express.app();
// const bcrypt = require('bcryptjs');
// const passport = require('passport');
// const { ensureAuthenticated } = require('../config/auth'); 


module.exports = function(app, passport) {

    const User = require('../models/user');
    const Uploads = require('../models/Upload');
    const bcrypt = require('bcryptjs');
    const { ensureAuthenticated } = require('../config/auth');
    
    var upmod = Uploads.find({});


    //---------Uploading Config------//
    var multer = require('multer');
    DIR = './Public/Upload/'
    const storage = multer.diskStorage({
        destination: function(req,file,cb) {
            cb(null,DIR)
        },
        filename: function(req,file,cb) {
            cb(null,file.fieldname + "-" + Date.now()+ "-"+ file.originalname)
        }
    }) 
    const upload = multer({
        storage: storage
    }).single('file');
    //-----------------------//

//Routing Before Login//

//Routing Handle Get Request
app.get('/', function(req, res, next) {  res.render('index', { title: 'Express' });});
//Get Request Handle
app.get('/index', function(req, res, next) {  res.render('index', { title: 'Express' });});
app.get('/about', (req, res, next) => {  res.render('about', { title: 'Express' });});
app.get('/blog_single', (req, res, next) =>{ res.render('blog_single', { title: 'Express'});});
app.get('/blog', (req, res, next) =>{ res.render('blog', { title: 'Express'});});
app.get('/contact', (req, res, next) =>{ res.render('contact', { title: 'Express'});});
app.get('/Login',   (req, res, next) =>{ res.render('Login', { title: 'Express'});});
app.get('/mentor', (req, res, next) =>{ res.render('mentor', { title: 'Express'});});
app.get('/project', (req, res, next) =>{ res.render('project', { title: 'Express'});});
app.get('/services', (req, res, next) =>{ res.render('services', { title: 'Express'});});
app.get('/register', (req, res, next) =>{ res.render('register', { title: 'Express'});});
//app.get('/uploadtest', (req, res, next) =>{ res.render('uploadtest', { title: 'Express'});});


//-----------------------//

//------Routing After Login------------//
//Get Request Handle

app.get('/Path/logout',ensureAuthenticated, (req, res) => {
    //req.logOut();
    req.flash('success_msg', 'You are Logged out');
    res.redirect('/login');
})

app.get('/Path/index', ensureAuthenticated, function(req, res) {
    res.render('index1', {
        name : req.user.name // get the user out of session and pass to template
    });
});

app.get('/Path/about', ensureAuthenticated, function(req, res) {
    res.render('about1', {
        name : req.user.name // get the user out of session and pass to template
    });
});

app.get('/Path/blog-single', ensureAuthenticated, function(req, res) {
    res.render('blog-single1', {
        name : req.user.name // get the user out of session and pass to template
    });
});

app.get('/Path/blog', ensureAuthenticated, function(req, res) {
    res.render('blog1', {
        name : req.user.name // get the user out of session and pass to template
    });
});

app.get('/Path/contact', ensureAuthenticated, function(req, res) {
    res.render('contact1', {
        name : req.user.name // get the user out of session and pass to template
    });
});

app.get('/Path/mentor', ensureAuthenticated, function(req, res) {
    res.render('mentor1', {
        name : req.user.name // get the user out of session and pass to template
    });
});

app.get('/Path/services', ensureAuthenticated, function(req, res) {
    res.render('services1', {
        name : req.user.name // get the user out of session and pass to template
    });
});

app.get('/Path/project', ensureAuthenticated, function(req, res) {
    res.render('project1', {
        name : req.user.name // get the user out of session and pass to template
    });
});

app.get('/dashboard', ensureAuthenticated, function(req, res) {
    res.render('dashboard', {
        user : req.user // get the user out of session and pass to template
    });
});

//-----------------------------//

//Register Handle
app.post('/register', (req, res) =>{
    const { name, email, password, password2 } = req.body;
    let errors = [];
    
    //Check required fields
    if(!name || !email || !password || !password2) {
        errors.push({ msg:'Please fill in all Fields'});
    }

    //Check password match
    if(password !== password2) {
        errors.push({ msg: 'Password do not match'});
    }

    //Check Password Length
    if(password.length < 6){
        errors.push({ msg: 'Password should be atleast 6 Characters'});
    }

    if(errors.length > 0){   
        res.render('register', {
           errors,
           name,
           email,
           password,
           password2
        });
    }
    else{
        //Vali dation Pass
       
        User.findOne({ email: email}) 
        .then(users => {
            if(users) {
                //User Exists
                errors.push({ msg: 'Email is already registered'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                 });
            }
            else {
                const newUser = new User({
                    name,
                    email,
                    password
                });
                
                //Hash Password
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) 
                            throw err;
                        // Set password to hash
                        newUser.password = hash;

                        //Save user
                        newUser.save()
                            .then(users => {
                                req.flash('success_msg', 'You are now registered and can Login');
                                res.redirect('login');
                                
                            })
                            .catch(err => console.log(err));
                }))
               
            }
        
        });

          
    }
});

// facebook -------------------------------
        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/dashboard',
                failureRedirect : '/'
            }));

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { 
        scope : ['public_profile', 'email']
      }));
  
      // handle the callback after facebook has authenticated the user
      app.get('/auth/facebook/callback',
          passport.authenticate('facebook', {
              successRedirect : '/dashboard',
              failureRedirect : '/'
          })); // route for facebook authentication and login
 
        app.get('/connect/facebook', passport.authorize('facebook', { 
            scope : ['public_profile', 'email'] 
          }));
      
          // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
              passport.authorize('facebook', {
                  successRedirect : '/profile',
                  failureRedirect : '/'
              }));
              
        app.get('/unlink/facebook', function(req, res) {
                var user            = req.user;
                user.facebook.token = undefined;
                user.save(function(err) {
                    res.redirect('/dashboard');
                });
            });
//Login Handle

app.post('/login',  (req, res, next) =>{
    passport.authenticate('local', {
        successRedirect: '/edit-profile',
        failureRedirect: 'login',
        failureFlash: true
    })(req, res, next);
});

//Logout Handle
app.get('/logout',ensureAuthenticated, (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You are Logged out');
    res.redirect('/login');
})

app.get('/edit-profile', ensureAuthenticated, function(req, res) {
    res.render('edit-profile', {
        name : req.user.name // get the user out of session and pass to template
    });
});

//-------Admin Stuff-------//
app.get('/forms-basic', (req,res) => {
    res.render('forms-basic')
})

/* Product Upload*/

app.get('/uploadtest',function(req,res){
    //product table
   
    Uploads.find(function(err,data){
        if(err){
            console.log(err)
        }
        else {
            
            console.log('Data is coming');
            console.log(data)
            res.render('uploadtest',{ records:data });
            console.log('upload successfull')
        }
    
    })
})

app.get('/admin', function(req, res, next) {
    upmod.exec(function(err,data){
  if(err) throw err;
  res.render('admin', { title: 'Mentor Details', records:data, success:'' });
    });
    
  });
        
app.post('/adminsub', upload, function(req, res, next) {
    var mentDetail = new Uploads({
      name: req.body.name,
      position: req.body.position,
      image:"Upload/" + res.req.file.filename,
    });
  
    mentDetail.save(function(err,req1){
      if(err) throw err;
      upmod.exec(function(err,data){
        if(err) throw err;
        else{
            req.flash('success_msg', 'Data Uploaded');
            res.render('admin', { title: 'Employee Records', records:data});
            }
        });
        })  
    });

app.get('/edit', function(req, res, next) {
    //var id=req.params.id;
    var edit= Uploads.find(req.body.id);
    edit.exec(function(err,data){
    if(err) throw err;
    res.render('edit', { title: 'Edit Record', records:data });
    });    
});

app.post('/update', upload,function(req, res, next) {
 
    if(req.file){
        var dataRecords={
            name: req.body.name,
            position: req.body.position,
            image:"Upload/" + res.req.file.filename,
        }
    }
    else{
        var dataRecords={
            name: req.body.name,
            position: req.body.position,
            
        }
    }
    var update= Uploads.findOneAndUpdate(req.body.id, dataRecords);
    update.exec(function(err,data){
        if(err) 
            throw err;
    upmod.exec(function(err,data){
        if(err) 
            throw err;
        res.redirect("/admin");  });
    });
});

app.get('/delete', function(req, res, next) {
    //var id=req.params.id;
    var del= Uploads.findOneAndDelete(req.body.id);
    
    del.exec(function(err){
        if(err) 
            throw err;
    upmod.exec(function(err,data){
        if(err) 
            throw err;
        else{
            req.flash('success_msg', 'Data Deleted');
            res.render('admin', { title: 'Employee Records', records:data});
            }
        });
    });  
});

}
