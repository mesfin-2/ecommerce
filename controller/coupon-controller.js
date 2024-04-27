const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../model/user-model.js");
const Coupon = require("../model/coupon-model.js");
const validateMongoDbId = require("../utils/validateMongodbid.js");


const createCoupon = async (req, res) => {
    try {
        const { name, expiry, discount } = req.body;
        const newCoupon = new Coupon({
        name,
        expiry,
        discount,
        });
        await newCoupon.save();
        res.status(201).json(newCoupon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
//get a coupon
const getACoupon = async (req, res) => {
    try {
        const { _id } = req.params;
        if (!validateMongoDbId(_id)) {
            return res.status(400).json({ message: "Invalid coupon id" });
        }
        const coupon = await Coupon.findById(id);
        res.status(201).json(coupon);
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//get all coupons
const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.status(201).json(coupons);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//Update a coupon
const updateCoupon = async (req, res) => {
    
        const { id } = req.params;

        if (id) {
            const { name, expiry, discount } = req.body;
            
            const updatedCoupon = await Coupon.findByIdAndUpdate(id, { name, expiry, discount }, { new: true });
            res.status(201).json(updatedCoupon);
        }
        // if (!updatedCoupon) {
        //     return res.status(404).json({ message: "Coupon not found" });
        // }
        
        return res.status(400).json({ message: "Invalid coupon id" });

    
}
const deleteCoupon = async (req, res) => {
    
        const { id } = req.params;

        if (id) {
        
            
            const deletedCoupon = await Coupon.findByIdAndDelete(id);
            res.status(201).json(deletedCoupon);
        }
        // if (!updatedCoupon) {
        //     return res.status(404).json({ message: "Coupon not found" });
        // }
        
        return res.status(400).json({ message: "Invalid coupon id" });

    
}

module.exports = {createCoupon,getACoupon,getAllCoupons,updateCoupon,deleteCoupon}