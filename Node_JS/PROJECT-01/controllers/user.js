const User = require("../models/user");

const handleGetAllUsers = async (req, res) => {
    const allDbUsers = await User.find({});
    return res.json(allDbUsers);
}

const handleGetUserbyId = async (req, res) => {
    const id = Number(req.params.id);
    const user = await User.findById(id);
    if(!user) {
        return res.status(404).json({status: "error", message: "User not found"});
    }
    return res.json(user);
}



module.exports = { handleGetAllUsers, handleGetUserbyId };