const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();


const userSchema = require("../Schema/userSchema");

//Mongoose Modal
const User = new mongoose.model("User", userSchema);

//SIGNUP
router.post('/signup', async (req, res) => {
    try {
        const hashPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,

        });
        await newUser.save();
        res.json({
            message: "User Successfully Save"
        });
    } catch (err) {
        res.json({
            message: "Sign Up failed!"
        });
    }

});

//SIGNIN
router.post('/signin', async (req, res) => {
    try {
        const user = await User.find({ email: req.body.email });
        if (user && user.length > 0) {
            const validPassword = await bcrypt.compare(req.body.password, user[0].password);
            if (validPassword) {
                //generate web token
                const token = jwt.sign({
                    name: user[0].name,
                    userId: user[0]._id,
                }, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                });
                res.status(200).json({
                    "access_token": token,
                    "message": "Login Successful !"
                })
            }
            else {
                res.status(401).json({
                    "error": "Authentication Failed !"
                })
            }
        } else {
            res.status(401).json({
                "error": "Authentication Failed !"
            })
        }
    } catch {
        res.status(401).json({
            "error": "Authentication Failed !"
        })
    }
});


module.exports = router;


