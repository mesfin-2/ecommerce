const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../model/user-model.js");
const Product = require("../model/productModel.js");
const Cart = require("../model/cart-model.js");
const Coupon = require("../model/coupon-model.js");
const Order = require("../model/order-model.js");
const validateMongoDbId = require("../utils/validateMongodbid.js");
var uniqid = require('uniqid'); 


const createUser = async (req, res) => {
  const { firstname, lastname, mobile, email, password } = req.body;
  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = await User.create(req.body); //sending entire body
  res.status(201).json({ message: "User successfully registered" });
};

//save user address
const saveUserAddress = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updatedUser = await User.findByIdAndUpdate(_id,{address:req.body.address},{new:true});
    return res.status(200).json(updatedUser);
    
  } catch (error) {
    res.status(400).json({ message: "User not found" });
    
  }

}

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  return res.status(200).json(users);
};
const getAuser = async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const user = await User.findById(id);
  console.log(user);
  return res.status(200).json(user);
};
const deleteAuser = async (req, res) => {
  const { id } = req.params;
  if (id) {
    const deletedUser = await User.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ message: "User  " + deletedUser.id + " deleted Successfully" });
  } else {
    res.status(400).json({ message: "user is not found" });
  }
};
const updateAuser = async (req, res) => {
  const { id } = req.user;
  validateMongoDbId(id);

  const { firstname, lastname, mobile, email } = req.body;
  if (id) {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstname,
        lastname,
        mobile,
        email,
      },
      { new: true }
    );

    return res.status(200).json(updatedUser);
  } else {
    res.status(400).json({ message: "user is not found" });
  }
};
const updatePassword = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const { password } = req.body;
  const user = await User.findById(_id);
   
   if (password) {
    user.password = password;
        
   const updatePassword = await user.save();
    return res.status(200).json(updatePassword);
  } else {
    res.status(400).json(user);
  }
};
const blockAuser = async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  await User.findByIdAndUpdate(
    id,
    {
      isBlocked: true,
    },
    { new: true }
  );

  return res.status(200).json({ message: "User blocked" });
};
const unBlockAuser = async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  await User.findByIdAndUpdate(
    id,
    {
      isBlocked: false,
    },
    { new: true }
  );

  return res.status(200).json({ message: "user unblocked" });
};

//get userwishlist
 const getUserWishlist = async (req, res) => {
   const { _id } = req.user;
   validateMongoDbId(_id);
   try {
      const findUser = await User.findById(_id).populate("wishlist");
      //const wishlist = findUser.wishlist;
      res.status(200).json(findUser);
    
   } catch (error) {
      res.status(400).json({ message: "User not found" });
    
   }

}
//get user cart
const getUserCart = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.findOne({ orderedBy: _id }).populate("products.product", "_id title price totalAfterDiscount");
    //const wishlist = findUser.wishlist;
    res.status(200).json(cart);
  
 } catch (error) {
    res.status(400).json({ message: "product not found" });
  
 }
}

//add to  cart
 const userCart = async (req, res) => {
  
    const { _id } = req.user;
    const { cart } = req.body;
    console.log("_id:", _id);
    validateMongoDbId(_id);
    try {
      let products = [];
        const user = await User.findById(_id);
        //check if product already exists in cart
       const existingProduct = await Cart.findOne({ orderedBy: user._id });

        if (existingProduct) {
          existingProduct.remove();

        }
       for(let i = 0; i < cart.length; i++){
         let object = {};
         object.product = cart[i]._id;
         object.quantity = cart[i].quantity;
         object.color = cart[i].color;
         object.price = cart[i].price;
         let price = await Product.findById(cart[i]._id).select("price").exec();
          object.price = price.price;
         products.push(object);
         console.log(products);
        }
        let cartTotal = 0;
        for(let i = 0; i < products.length; i++){
          cartTotal = cartTotal + products[i].price * products[i].quantity;
        }

        const newCart = await new Cart({
          products,
          cartTotal,
          orderedBy: user._id,
        }).save();
        res.status(200).json(newCart);
      
    } catch (error) {
        res.status(400).json({ message: "User not found!!!" });
 }
}
//Empty cart
const emptyCart = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await User.findById(_id);
    const cart = await Cart.findOneAndDelete({ orderedBy: user._id });
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ message: "Cart not found" });
  }
};
//apply coupon

const applyCoupon = async (req, res) => {
  try {
    const { coupon } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);

    console.log("Coupon:", coupon); // Log the coupon value

    const validCoupon = await Coupon.findOne({ name: coupon });
    console.log("Valid Coupon:", validCoupon); // Log the result of the database query

    if (!validCoupon) {
      throw new Error("Invalid Coupon");
    }

    const user = await User.findOne({ _id });
    const cart = await Cart.findOne({ orderedBy: user._id }).populate("products.product");

    // Extract the cartTotal from the cart object
    let cartTotal = 0;
    for (const item of cart.products) {
      cartTotal += item.product.price * item.quantity;
    }

    let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);

    await Cart.findOneAndUpdate(
      { orderedBy: user._id },
      { totalAfterDiscount },
      { new: true }
    );

    res.json(totalAfterDiscount);
  } catch (error) {
    console.error("Error applying coupon:", error);
    res.status(400).json({ message: "Coupon not found or invalid" });
  }
};

//create order
const createOrder = async (req, res) => {
  try {
    const { COD, couponApplied } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);

    console.log("User ID:", _id);

    if (!COD) {
      return res.status(400).send("Create order failed");
    }

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    const cart = await Cart.findOne({ orderedBy: user._id });
    if (!cart) {
      throw new Error("Cart not found");
    }

    let finalAmount = 0;
    if (couponApplied && cart.totalAfterDiscount) {
      finalAmount = cart.totalAfterDiscount;
    } else {
      finalAmount = cart.cartTotal;
    }

    const newOrder = new Order({
      products: cart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmount,
        currency: "usd",
        status: "Cash On Delivery",
        created: Date.now(),
        payment_method_types: ["cash"],
      },
      orderedBy: user._id,
      orderStats: "Cash On Delivery",
    }).save();
    //decrement quantity, increment sold

    let bulkOption = cart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
      };
    });
//update product quantity and sold
    let updated = await Product.bulkWrite(bulkOption, {});

    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(400).json({ message: error.message });
  }
};

//get user orders
const getUserOrders = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const orders = await Order.find({ orderedBy: _id }).populate("products.product");
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: "Orders not found" });
  }
};
//update order status
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const {  orderStatus } = req.body;
  try {
    const updatedOrder = await Order.findByIdAndUpdate
    (id, { orderStatus }, { new: true });
    res.status(200).json(updatedOrder);
  }
  catch (error) {
    res.status(400).json({ message: "Order not found" });
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getAuser,
  deleteAuser,
  updateAuser,
  blockAuser,
  unBlockAuser,
  updatePassword,
  getUserWishlist,
  saveUserAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getUserOrders,
  updateOrderStatus,
  
  
};
