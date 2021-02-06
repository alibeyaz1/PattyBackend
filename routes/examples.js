const express = require("express");

const Example = require("../models/example");

const router = express.Router();

router.get("", (req, res, next) => {
  Example.find().then(response => {
    res
      .status(200)
      .json({ message: "Example Fetched Successfully!", example: response });
  });
});

router.get("/:id", (req, res, next) => {
  Example.findById(req.params.id).then(response => {
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: "Example Not Found!" });
    }
  });
});

router.post(
  "", (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");

    const example = new Example({
      
    });

    example.save().then(result => {
      res.status(201).json({
        message: "Example Added Successfully!",
        example: {
          ...result,
          id: result._id
        }
      });
    });
  }
);

router.put(
  "/:id", (req, res, next) => {

    const example = {
      
    };

    Example.updateOne({ _id: req.params.id }, example)
      .then(result => {
        res.status(200).json({
          message: "Update Successful!",
          example: {
            ...result,
            id: result.id
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Update Failed!" });
      });
  }
);

router.delete("/:id", (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");

  Example.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json({ message: "Example deleted!" });
  });
});

module.exports = router;