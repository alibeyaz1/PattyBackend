const express = require('express');

const checkAuth = require('../middleware/check-auth');
const Order = require('../models/order');
const product = require('../models/product');

const router = express.Router();

router.get('', checkAuth, (req, res, next) => {
  const isSeller = req.params.isSeller;
  if (isSeller) {
    Order.find({ seller: req.params.userId })
      .limit(7)
      .then((response) => {
        res
          .status(200)
          .json({ message: 'Orders Fetched Successfully!', orders: response });
      });
  } else {
    Order.find({ customer: req.params.userId }).then((response) => {
      res
        .status(200)
        .json({ message: 'Orders Fetched Successfully!', orders: response });
    });
  }
});

router.get('/count', (req, res, next) => {
  const filter = req.query.filter;

  switch (filter) {
    case 'daily':
      Order.find({
        seller: req.params.userId,
        created_at: {
          $gte: new Date(),
          $lt: new Date(),
        },
      })
        .count()
        .then((response) => {
          Order.find({
            seller: req.params.userId,
            created_at: {
              $gte: new Date(),
              $lt: new Date(),
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

    case 'weekly':
      Order.find({
        seller: req.params.userId,
        created_at: {
          $gte: new Date() - 7,
          $lt: new Date(),
        },
      })
        .count()
        .then((response) => {
          Order.find({
            seller: req.params.userId,
            created_at: {
              $gte: new Date() - 7,
              $lt: new Date(),
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
        created_at: {
          $gte: new Date() - 30,
          $lt: new Date(),
        },
      })
        .count()
        .then((response) => {
          Order.find({
            seller: req.params.userId,
            created_at: {
              $gte: new Date() - 30,
              $lt: new Date(),
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
  if (!req.body.customer || !req.body.seller || !req.body.comment) {
    res.status(400).json({
      message: 'Required fields are not filled',
    });
  } else if (req.body.point < 0 || req.body.point > 5) {
    res.status(400).json({
      message: 'Point is not valid',
    });
  } else {
    const order = new Order({
      date: req.body.date,
      customer: req.body.customer,
      products: req.body.products,
      totalPrice: req.body.totalPrice,
    });

    order.save().then((result) => {
      for (let i = 0; i < order.products.length; i++) {
        order.product[i].updateOne(
          { _id: order.products[i] },
          { $inc: { sold: 1 } }
        );
      }
      res.status(201).json({
        message: 'Order Added Successfully!',
        order: {
          ...result,
          id: result._id,
        },
      });
    });
  }
});

module.exports = router;
