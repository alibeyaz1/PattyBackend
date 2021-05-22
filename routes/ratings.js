const express = require('express');

const checkAuth = require('../middleware/check-auth');
const Rating = require('../models/rating');
const User = require('../models/user');

const router = express.Router();

router.get('', (req, res, next) => {
  Rating.find().then((response) => {
    res
      .status(200)
      .json({ message: 'Rating Fetched Successfully!', rating: response });
  });
});

router.get('/:id', (req, res, next) => {
  Rating.findById(req.params.id).then((response) => {
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: 'Rating Not Found!' });
    }
  });
});

router.get('/all/:id', (req, res, next) => {
  Rating.find({ seller: req.params.id }).then((response) => {
    res.status(200).json({ ratings: response });
  });
});

router.post('', checkAuth, (req, res, next) => {
  if (!req.body.seller || !req.body.comment) {
    res.status(400).json({
      message: 'Required fields are not filled',
    });
  } else {
    User.findById(req.params.userId).then((result) => {
      const rating = new Rating({
        customer: result.name,
        seller: req.body.seller,
        comment: req.body.comment,
      });

      rating.save().then((result) => {
        res.status(201).json({
          message: 'Rating Added Successfully!',
          rating: {
            ...result,
            id: result._id,
          },
        });
      });
    });
  }
});

module.exports = router;
