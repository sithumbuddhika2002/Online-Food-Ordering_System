const mongoose = require("mongoose");
const{Schema}=mongoose;

const PromotionSchema = new Schema({
    promotionID: {
        type: String,
        required: true,
        unique: true,  
    },
    code: {
        type: String,
        required: true,
    },
    foodItem: {
        type: String,
        required: true,
    },
    codeCategory: {
        type: String,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    expirationDate: {
        type: Date,  
        required: true,
    },
});

module.exports = Promotion = mongoose.model("Promotion",PromotionSchema);