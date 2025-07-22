import mongoose from "mongoose";


const schema = new mongoose.Schema({

    couponCode: {
        type: String,
        required: [false, "Please enter the Coupon Code"],
        default: null,
        trim: true,
        unique: true
    },
    amount: {
        type: Number,
        required: [true, "Please enter the Discounted Amount"]
    }
});

export const Coupon = mongoose.model("Coupon", schema);