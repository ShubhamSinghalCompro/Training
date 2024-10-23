const User = require("../models/users");
const {v4: uuidv4} = require("uuid");
const{setUser, getUser} = require("../services/auth");
const handleUserSignUp = async (req, res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }
    const user = await User.findOne({email: email});
    if(user) {
        return res.status(400).json({
            success: false,
            message: "User already exists"
        });
    }
    const newUser = await User.create({
        name: name,
        email: email,
        password: password
    });
    // return res.status(201).json({
    //     success: true,
    //     message: "User created successfully",
    //     user: newUser
    // });

    return res.render("home", {
        success: true,
        message: "User created successfully",
        user: newUser
    });
}

const handleUserLogin = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }
    const user = await User.findOne({email: email});
    if(!user) {
        return res.status(400).json({
            success: false,
            message: "User not found"
        });
    }
    if(user.password !== password) {
        return res.status(400).json({
            success: false,
            message: "Incorrect password"
        });
    }
    // return res.status(200).json({
    //     success: true,    
    //     message: "User logged in successfully",
    //     user: user    
    // });  

    // const sessionId = uuidv4();
    // setUser(sessionId, user);
    // res.cookie("sessionId", sessionId);

    const token = setUser("",user);
    res.cookie("uid", token);
   
    return res.redirect("/");
    // return res.render("home", {
    //     success: true,    
    //     message: "User logged in successfully",
    //     user: user                  
    // })
}

module.exports = {
    handleUserSignUp,
    handleUserLogin
};