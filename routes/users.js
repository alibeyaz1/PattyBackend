const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

const User = require('../models/user');

const router = express.Router();

router.get('/sellers', (req, res, next) => {
  User.find({ isSeller: true }).then((response) => {
    res.status(200).json({ sellers: response });
  });
});

router.put('/change-adress', checkAuth, (req, res, next) => {
  User.findById(req.params.userId).then((result) => {
    result.address = req.body.adress;
    result.save().then((result) => {
      res.status(200).json({ message: 'Success' });
    });
  });
});

router.put('/change-name', checkAuth, (req, res, next) => {
  User.findById(req.params.userId).then((result) => {
    result.name = req.body.name;
    result.save().then((result) => {
      res.status(200).json({ message: 'Success' });
    });
  });
});

router.post('/signup', (req, res, next) => {
  console.log(req.body.password);
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
        name: req.body.email,
        isSeller: false,
      });

      user
        .save()
        .then((result) => {
          res.status(201).json({
            message: 'User added successfully',
          });
        })
        .catch((err) => {
          res.status(500).json({
            err: err,
          });
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth Failed!',
        });
      }

      fetchedUser = user;

      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: 'Auth Failed!',
        });
      }

      const token = jwt.sign(
        {
          username: fetchedUser.username,
          userId: fetchedUser._id,
          email: fetchedUser.email,
          isSeller: fetchedUser.isSeller,
          address: fetchedUser.address,
        },
        'PATTY_TOKEN_KEY',
        { expiresIn: '3h' }
      );

      res.status(200).json({
        token: token,
        expiresIn: 10800,
        userId: fetchedUser._id,
        username: fetchedUser.username,
        isSeller: fetchedUser.isSeller,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: 'Auth Failed!',
      });
    });
});

router.post('/newPass', checkAuth, (req, res, next) => {
  let fetchedUser;

  User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: 'User not found!' });
      }

      fetchedUser = user;

      return bcrypt.compare(req.body.oldPass, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: 'Old Password Is Incorrect!',
        });
      }

      bcrypt.hash(req.body.newPass, 10).then((hash) => {
        User.updateOne({ _id: req.body.userId, password: hash }).then(
          (result) => {
            res.status(200).json({
              message: 'Update Successful!',
            });
          }
        );
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: 'Old Password Is Incorrect!',
      });
    });
});

router.delete('/:id', checkAuth, (req, res, next) => {
  User.deleteOne({ _id: req.params.userId }).then((result) => {
    res.status(200).json({ message: 'User deleted!' });
  });
});

module.exports = router;
