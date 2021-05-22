const express = require('express');

const checkAuth = require('../middleware/check-auth');
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');

const router = express.Router();

router.get('', checkAuth, (req, res, next) => {
  User.findById(req.params.userId).then((result) => {
    const isSeller = result.isSeller;
    if (isSeller) {
      Order.find({ seller: req.params.userId })
        .limit(7)
        .then((response) => {
          res.status(200).json({
            message: 'Orders Fetched Successfully!',
            orders: response,
          });
        });
    } else {
      Order.find({ customer: req.params.userId }).then((response) => {
        res
          .status(200)
          .json({ message: 'Orders Fetched Successfully!', orders: response });
      });
    }
  });
});

router.get('/count', checkAuth, (req, res, next) => {
  const filter = req.query.filter;

  switch (filter) {
    case 'daily':
      Order.find({
        seller: req.params.userId,
        date: {
          $gte: new Date().toDateString(),
          $lte: Date.now(),
        },
      })
        .count()
        .then((response) => {
          Order.find({
            seller: req.params.userId,
            date: {
              $gte: new Date().toDateString(),
              $lte: Date.now(),
            },
          }).then((result) => {
            console.log(result);
            let total = 0;
            for (let i = 0; i < result.length; i++) {
              total += result[i].totalPrice;
            }

            res.status(200).json({
              message: 'Orders Fetched Successfully!',
              orderCount: response,
              orderTotal: total,
            });
          });
        });
      break;

    case 'weekly':
      Order.find({
        seller: req.params.userId,
        date: {
          $gte: new Date().setDate(new Date().getDate() - 7),
          $lt: Date.now(),
        },
      })
        .count()
        .then((response) => {
          Order.find({
            seller: req.params.userId,
            date: {
              $gte: new Date().setDate(new Date().getDate() - 7),
              $lte: Date.now(),
            },
          }).then((result) => {
            let total = 0;
            for (let i = 0; i < result.length; i++) {
              total += result[i].totalPrice;
            }

            res.status(200).json({
              message: 'Orders Fetched Successfully!',
              orderCount: response,
              orderTotal: total,
            });
          });
        });
      break;

    case 'monthly':
      Order.find({
        seller: req.params.userId,
        date: {
          $gte: new Date().setDate(new Date().getDate() - 30),
          $lte: Date.now(),
        },
      })
        .count()
        .then((response) => {
          Order.find({
            seller: req.params.userId,
            date: {
              $gte: new Date().setDate(new Date().getDate() - 30),
              $lt: Date.now(),
            },
          }).then((result) => {
            let total = 0;
            for (let i = 0; i < result.length; i++) {
              total += result[i].totalPrice;
            }

            res.status(200).json({
              message: 'Orders Fetched Successfully!',
              orderCount: response,
              orderTotal: total,
            });
          });
        });
      break;

    case 'all':
      Order.find({
        seller: req.params.userId,
      })
        .count()
        .then((response) => {
          console.log(response);
          Order.find({
            seller: req.params.userId,
          }).then((result) => {
            let total = 0;
            for (let i = 0; i < result.length; i++) {
              total += result[i].totalPrice;
            }

            res.status(200).json({
              message: 'Orders Fetched Successfully!',
              orderCount: response,
              orderTotal: total,
            });
          });
        });
      break;

    default:
      break;
  }
});

router.get('/:id', (req, res, next) => {
  Order.findById(req.params.id).then((response) => {
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: 'Order Not Found!' });
    }
  });
});

router.post('', checkAuth, (req, res, next) => {
  if (!req.body.seller || !req.body.totalPrice) {
    res.status(400).json({
      message: 'Required fields are not filled',
    });
  } else {
    let totalPrice = 0;
    User.findById(req.params.userId).then((result) => {
      if (!result.address) {
        return res
          .status(400)
          .json({ message: 'You should enter your adress before ordering' });
      }
      const order = new Order({
        customer: req.params.userId,
        seller: req.body.seller,
        date: Date.now(),
        customerName: result.name,
        address: result.address,
        products: req.body.products,
        totalPrice: req.body.totalPrice,
      });

      order.save().then((result) => {
        console.log(result);
        for (let i = 0; i < order.products.length; i++) {
          Product.updateOne(
            { _id: order.products[i] },
            { $inc: { sold: 1 } }
          ).then((result) => {
            res.status(201).json({
              message: 'Order Added Successfully!',
            });
          });
        }
      });
    });
  }
});

module.exports = router;
