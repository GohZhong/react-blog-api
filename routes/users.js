const router = require('express').Router();
const User = require('../models/user');
const Post = require('../models/post')
const bcrypt = require('bcrypt');

//UPDATE
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id) {
        if (req.body.password) {
            try{
                req.body.password = await bcrypt.hash(req.body.password, 10)
            } catch (err){
                res.status(500).json(err);
            }
        }
        try {
            return User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }  //*check why need new: true
            )
            .then((resp)=>{
                const {password, ...updatedUser} = resp._doc;
                res.status(200).json(updatedUser);
            })
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(401).json("You can only update your account!");
    }
});

//DELETE
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            console.log(user)
            try {
                await Post.deleteMany({ username: user.username });
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("User has been deleted...");
            } catch (err) {
                res.status(500).json(err);
            }
        } catch (err) {
            res.status(404).json("User not found!");
        }
    } else {
        res.status(401).json("You can delete only your account!");
    }
});
  
//GET USER BY ID
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET USER BY USERNAME
router.get("/author/:authorname", async (req, res) => {
    try {
        const user = await User.find({username: req.params.authorname});
        const { password, ...others } = user[0]._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;