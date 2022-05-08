const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const blogSchema = require("../Schema/blogSchema");
const checkLogin = require("../Middleware/authMiddleware");

//Mongoose Modal
const Blog = new mongoose.model("Blog", blogSchema);

//get all post
router.get('/', checkLogin, async (req, res) => {
    console.log(req.user);
    console.log(req.userId);
    try {
        const posts = await Blog.find();
        res.json(posts);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

//insert a post
router.post('/', checkLogin, async (req, res) => {
    try {
        const newBlog = new Blog(req.body);
        await newBlog.save(() => {
            res.json({
                message: "Blog inserted successfully!"
            });
        });
    } catch (err) {
        res.json({
            message: "There is a server side error!"
        });
    }

});


//get specific post
router.get('/:postId', checkLogin, async (req, res) => {
    try {
        const post = await Blog.findById(req.params.postId);
        res.json(post);
    } catch (err) {
        res.json({
            message: "There is a server side error!"
        });
    }
});


//update a post
router.patch('/:postId', checkLogin, async (req, res) => {
    try {
        const updatePost = await Blog.findByIdAndUpdate(
            { _id: req.params.postId },
            {
                $set: {
                    title: req.body.title
                }
            }, {
            new: true
        }
        );
        res.json(updatePost);
    } catch (err) {
        res.json({
            message: "There is a server side error!"
        });
    }
});


//delete a post
router.delete('/:postId', checkLogin, async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.postId);
        res.json("Remove Post Successfully");
    } catch (err) {
        res.json({
            message: "There is a server side error!"
        });
    }
});


module.exports = router;


