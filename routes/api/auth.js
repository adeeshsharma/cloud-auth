// To handel all authorization

const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check , validationResult } = require('express-validator');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const express = require('express');
const router = express.Router();

// @route   GET api/auth
// @desc    Test Route
// @access  public
router.get('/', auth, async (req,res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch{
        console.log(err.message);
        res.status(500).send('Server Error');

    }
});

// @route   POST api/auth
// @desc    authenticate user and get token
// @access  Public
router.post('/', [
    check('email',"Please include a valid Email address!").isEmail(),
    check("password", "Password is required!").exists()
],
async (req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;

    try{
        // see if the user exists
        let user = await User.findOne({email});

        if(!user){
            return res.status(400).json({ errors: [{msg: 'Invalid credentials!'}] });
        }

        //compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({ errors: [{msg: 'Invalid credentials!'}] });
        }

        // Sign and return json web token

        const jwtPayload ={
            user:{
                id: user.id
            }
        }

        jwt.sign(jwtPayload, config.get('jwtSecret'), { expiresIn:360000 }, (err , token)=>{
            if(err) throw err;
            res.json({ token });
        });
    }
    catch(err){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
   
});

module.exports = router;