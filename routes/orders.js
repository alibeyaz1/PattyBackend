const express = require("express");

const checkAuth = require("../middleware/check-auth");
const Order = require("../models/order");

const router = express.Router();

router.get("", (req, res, next) => {
    Order.find().then(response => {
        res
            .status(200)
            .json({ message: "Order Fetched Successfully!", order: response });
    });
});

router.get("/:id", (req, res, next) => {
    Order.findById(req.params.id).then(response => {
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ message: "Order Not Found!" });
        }
    });
});

router.post(
    "", checkAuth, (req, res, next) => {
        if (!req.body.customer || !req.body.seller || !req.body.comment) {
            res.status(400).json({
                message: "Required fields are not filled"
            });
        } else if (req.body.point < 0 || req.body.point > 5) {
            res.status(400).json({
                message: "Point is not valid"
            });
        } else {

            const order = new Order({

                date: req.body.date,
                customer: req.body.customer,
                products: req.body.products,
                totalPrice: req.body.totalPrice
            });

            order.save().then(result => {
                res.status(201).json({
                    message: "Order Added Successfully!",
                    order: {
                        ...result,
                        id: result._id
                    }
                });
            });
        }
    }
);

module.exports = router;