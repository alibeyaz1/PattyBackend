const express = require("express");

const checkAuth = require("../middleware/check-auth");
const Rating = require("../models/rating");

const router = express.Router();

router.get("", (req, res, next) => {
    Rating.find().then(response => {
        res
            .status(200)
            .json({ message: "Rating Fetched Successfully!", rating: response });
    });
});

router.get("/:id", (req, res, next) => {
    Rating.findById(req.params.id).then(response => {
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ message: "Rating Not Found!" });
        }
    });
});

router.get("/all/:id", (req, res, next) => {
    var result = [];
    Rating.find().then(response => {
        if (response) {
            response.forEach(el => {
                if (el.seller === req.params.id) {
                    result.push(el);
                }
            });
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Rating Not Found!" });
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

            const rating = new Rating({
                customer: req.body.customer,
                seller: req.body.customer,
                comment: req.body.comment,
                point: req.body.point
            });

            rating.save().then(result => {
                res.status(201).json({
                    message: "Rating Added Successfully!",
                    rating: {
                        ...result,
                        id: result._id
                    }
                });
            });
        }
    }
);

module.exports = router;