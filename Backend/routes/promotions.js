const express = require("express");
const router = express.Router();
const Promotions = require("../models/promotion");

// Test route
router.get("/test", (req, res) => res.send("Promotion routes working"));

// Insert promo code
router.post("/", async (req, res) => {
    const { promotionID, code, foodItem, codeCategory, discount, expirationDate } = req.body;

    if (!promotionID) {
        return res.status(400).json({ error: "Promotion ID is required" });
    }

    const newPromotion = new Promotion({
        promotionID,
        code,
        foodItem,
        codeCategory,
        discount,
        expirationDate,
    });

    try {
        await newPromotion.save(); 
        res.json({ msg: "Promotion Added Successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error adding promotion" });
    }
});

// View Promotions
router.get("/", (req, res) => {
    Promotions.find()
        .then((promotions) => res.json(promotions))
        .catch(() => res.status(400).json({ msg: "Promotions Not Found" }));
});

// View Promotion by ID
router.get("/:id", (req, res) => {
    Promotions.findById(req.params.id)
        .then((promotion) => res.json(promotion))
        .catch(() => res.status(400).json({ msg: "Cannot Find Any Promotions" }));
});

// Update Promotion
router.put("/:id", (req, res) => {
    Promotions.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(() => res.json({ msg: "Update Successfully!" }))
        .catch(() => res.status(400).json({ msg: "Update Failed" }));
});

// Delete Promotion
router.delete("/:id", (req, res) => {
    Promotions.findByIdAndDelete(req.params.id)
        .then(() => res.json({ msg: "Deleted Successfully" }))
        .catch(() => res.status(400).json({ msg: "Cannot be Deleted" }));
});

module.exports = router;
