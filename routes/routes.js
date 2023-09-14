const express = require('express');
const router = express.Router();
const User = require('../models/users');

// For inserting a user into Database
router.post("/add", async (req, res) => {
    try {
      const user = new User({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email
      });
  
      await user.save(); // Save the user and wait for the promise to resolve
  
      req.session.message = {
        type: "success",
        message: "User added successfully!"
      };
      res.redirect("/");
    } catch (err) {
      res.json({ message: err.message, type: "danger" });
    }
  });
  

// Get all users route
router.get("/", async (req, res) => {
    try {
      const users = await User.find().exec();
        res.render('index', {
        title: "Home Page",
        users: users,
        message: req.session.message
      });
    } catch (err) {
      res.json({ message: err.message });
    }
  });
  
router.get('/add', (req, res) => {
    res.render('add_users', { title: "Add Users"})
});

    // Edit an user route
    router.get('/edit/:id', async (req, res) => {
        try {
          const id = req.params.id;
          const user = await User.findById(id).exec();
      
          if (!user) {
            res.redirect('/');
          } else {
            res.render('edit_users', {
              title: 'Edit Users',
              user: user,
            });
          }
        } catch (err) {
          console.error(err);
          res.redirect('/');
        }
      });
      
      //Update user route
      router.post('/update/:id', async (req, res) => {
        try {
          const id = req.params.id;
          const user = await User.findById(id);
      
          if (!user) {
            return res.json({ message: 'User not found', type: 'danger' });
          }
      
          // Update user properties
          user.name = req.body.name;
          user.phone = req.body.phone;
          user.email = req.body.email;
      
          // Save the updated user
          await user.save();
      
          req.session.message = {
            type: 'success',
            message: 'User updated successfully!',
          };
          return res.redirect('/');
        } catch (err) {
          console.error(err);
          return res.json({ message: err.message, type: 'danger' });
        }
      });
    
      // Delete a user route
      router.get('/delete/:id', async (req, res) => {
        try {
          const id = req.params.id;
          const user = await User.findById(id);
      
          if (!user) {
            return res.json({ message: 'User not found' });
          }
      
          // Delete the user
           user.deleteOne();
      
          req.session.message = {
            type: 'info',
            message: 'User Deleted Successfully!',
          };
      
          return res.redirect('/');
        } catch (err) {
          console.error(err);
          return res.json({ message: err.message });
        }
      });
      
    

module.exports = router;