const { response } = require('express');
const express = require('express');
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');
const Product = require('../models/product');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type!');

    if (isValid) {
      error = null;
    }

    cb(error, ' /../images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  },
});

router.get('', (req, res, next) => {
  const isSeller = req.params.isSeller;

  if (isSeller) {
    Product.find({ seller: req.params.userId }).then((response) => {
      res
        .status(200)
        .json({ message: 'Product Fetched Successfully!', product: response });
    });
  } else {
    Product.find().then((response) => {
      res
        .status(200)
        .json({ message: 'Product Fetched Successfully!', product: response });
    });
  }
});

router.get('/bestseller', (req, res, next) => {
  Product.find({ sold: { $gte: 10 } })
    .limit(7)
    .then((response) => {
      res
        .status(200)
        .json({ message: 'Best Sellers fetched!', products: response });
    });
});

router.get('/:id', (req, res, next) => {
  Product.findById(req.params.id).then((response) => {
    if (response) {
      res.status(200).json({ product: response });
    } else {
      res.status(404).json({ message: 'Product Not Found!' });
    }
  });
});

router.post(
  '',
  checkAuth,
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    if (
      !req.body.seller ||
      !req.body.name ||
      !req.body.category ||
      !req.body.price ||
      !req.body.description ||
      req.body.ingredients.length == 0
    ) {
      res.status(400).json({
        message: 'Required fields are not filled',
      });
    } else {
      const url = req.protocol + '://' + req.get('host');

      const product = new Product({
        seller: req.body.seller,
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        description: req.body.description,
        isWeight: req.body.isWeight,
        ingredients: req.body.ingredients,
        imagePath: url + '/images/' + req.file.filename,
        sold: 0,
      });

      product.save().then((result) => {
        res.status(201).json({
          message: 'Product Added Successfully!',
          product: {
            ...result,
            id: result._id,
          },
        });
      });
    }
  }
);

router.put(
  '/:id',
  checkAuth,
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    if (
      !req.body.seller ||
      !req.body.name ||
      !req.body.category ||
      !req.body.price ||
      !req.body.description ||
      req.body.ingredients.length == 0
    ) {
      res.status(400).json({
        message: 'Required fields are not filled',
      });
    } else {
      const url = req.protocol + '://' + req.get('host');

      const product = new Product({
        seller: req.body.seller,
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        description: req.body.description,
        isWeight: req.body.isWeight,
        ingredients: req.body.ingredients,
        imagePath: url + '/images/' + req.file.filename,
      });

      Product.updateOne({ _id: req.params.id }, product)
        .then((result) => {
          res.status(200).json({
            message: 'Update Successful!',
            product: {
              ...result,
              id: result.id,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: 'Update Failed!' });
        });
    }
  }
);

router.delete('/:id', checkAuth, (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');

  Product.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({ message: 'Product deleted!' });
  });
});

module.exports = router;
