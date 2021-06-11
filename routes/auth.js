const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

//Register
router.post("/register", async (req,res)=>{
    try{
        bcrypt.hash(req.body.password, 10)
        .then(function(hash){
            return new User({
                username: req.body.username,
                email: req.body.email,
                password: hash,
            })
        })
        .then((newUser)=>newUser.save()) 
        .then((user)=>res.json(user))
        .catch((err)=>res.status(400).json(err))
    } catch(err){
        res.status(500).json(err);
    }
});

//Login
router.post("/login", (req, res)=>{
    try{
        return User.findOne({username: req.body.username})
        .then((user)=>{
            if (user){
                bcrypt.compare(req.body.password, user.password)
                .then((validated)=> {
                    if(validated){
                        const {password, ...others} = user._doc;
                        res.json(others);
                    } else {
                        res.status(400).json("Wrong credentials!")
                    }
                })
            } else {
                res.status(400).json("Wrong credentials!")
            }
        })
        .catch(()=>res.status(400).json("Wrong credentials"))
    } catch(err) {
        res.status(500).json(err)
    }
})

module.exports = router;