const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {handleGetAllUsers, handleGetUserbyId} = require('../controllers/user');

//Routes

//REST API 

router.get('/', handleGetAllUsers);


router.post('/', async (req, res) => {
    // TODO - Create a new user
    const body = req.body;
    if(!body || !body.firstName || !body.lastName || !body.email || !body.gender || !body.jobTitle) {
        return res.status(400).json({status: "error", message: "All fields are required"});
    }
    console.log(body);
    // users.push({...body, id: users.length + 1});
    // fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => { if (err) throw err;
    //     return res.status(201).json({status: "success", message: "User created successfully! with id: " + users.length});
    // });

    // const result = await User.create({
    //     firstName: body.first_name,
    //     lastName: body.last_name,
    //     email: body.email,
    //     gender: body.gender,
    //     jobTitle: body.job_title
    // });

    const result = await User.create(body);
    console.log(result);
    return res.status(201).json({status: "success", message: "User created successfully! with id: " + result._id});
});

// router.get('/api/users/:id', (req, res) => {
//     const id = Number(req.params.id);
//     const user = users.find(user => user.id === id);
//     return res.json(user);
// });

// router.patch('/api/users/:id', (req, res) => {
//     // TODO - Edit the user
//     return res.json({status: "pending"});
// });

// router.delete('/api/users/:id', (req, res) => {
//     // TODO - Delete the user
//     return res.json({status: "pending"});
// });

// router.put('/api/users/:id', (req, res) => {
//     // TODO - Update the user
//     return res.json({status: "pending"});
// });

router.route('/:id')
    .get(
        // async(req, res) => {
        // // const id = Number(req.params.id);
        // // const user = users.find(user => user.id === id);

        // const user = await User.findById(req.params.id);
        // if(!user) {
        //     return res.status(404).json({status: "error", message: "User not found"});
        // }
        // return res.json(user);}
        handleGetUserbyId
)
    .patch((req, res) => {
        // TODO - Edit the user
        const id = Number(req.params.id);
        const body = req.body;
        // let user = users.find(user => user.id === id);

        // if(!user) {
        //     return res.json({status: "error", message: "User not found"});
        // }
        // // only update the fields that were sent
        // console.log(body);
        // console.log(user);

        // user.first_name = body.first_name || user.first_name;
        // user.last_name = body.last_name || user.last_name;
        // user.email = body.email || user.email;
        // user.gender = body.gender || user.gender;
        // user.job_title = body.job_title || user.job_title;

        
        //user = {...user, ...body}; // does not work as new obj is created

        const userIndex = users.findIndex(user => user.id === id);

        if (userIndex === -1) {
            return res.json({status: "error", message: "User not found"});
        }

        // Update the user in the array using the spread operator
        users[userIndex] = {
            ...users[userIndex],  // existing user data
            ...body               // fields to update
        };

        console.log(users[userIndex]);

        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => { if (err) throw err;
            return res.json({status: "success", message: "User updatedslly!sfu with id: " + id});
        });
    })
    .delete((req, res) => {
        // TODO - Delete the user
        const id = Number(req.params.id);

        // find the user
        const userIndex = users.findIndex(user => user.id === id);

        if (userIndex === -1) {
            return res.json({status: "error", message: "User not found"});
        }

        users.splice(userIndex, 1);

        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => { if (err) throw err;
            return res.json({status: "success", message: "User deleted successfully! with id: " + id});
        });
    })
    // .put((req, res) => {
    //     const id = Number(req.params.id);
    
    //     // Find the user
    //     const userIndex = users.findIndex(user => user.id === id);
    
    //     if (userIndex === -1) {
    //         return res.json({status: "error", message: "User not found"});
    //     }
    
    //     // Get the existing user data
    //     const existingUser = users[userIndex];
    
    //     // Create a new object where unspecified fields become `null`
    //     const updatedUser = {
    //         id,  // preserve the ID
    //         first_name: req.body.first_name !== undefined ? req.body.first_name : null,
    //         last_name: req.body.last_name !== undefined ? req.body.last_name : null,
    //         email: req.body.email !== undefined ? req.body.email : null,
    //         gender: req.body.gender !== undefined ? req.body.gender : null,
    //         job_title: req.body.job_title !== undefined ? req.body.job_title : null,
    //         // Add any additional fields here
    //     };
    
    //     // Update the user in the array
    //     users[userIndex] = updatedUser;
    
    //     // Save to the file
    //     fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
    //         if (err) throw err;
    //         return res.json({status: "success", message: "User updated successfully with id: " + id});
    //     });
    // });
    .put((req, res) => {
        const id = Number(req.params.id);
    
        // Find the user
        const userIndex = users.findIndex(user => user.id === id);
    
        if (userIndex === -1) {
            return res.json({status: "error", message: "User not found"});
        }
    
        // Get the existing user data
        const existingUser = users[userIndex];
    
        // Create a new user object by iterating over the existing fields
        const updatedUser = {
            id, // preserve the ID
            ...Object.keys(existingUser).reduce((acc, key) => {
                // Keep the fields from req.body, or set them to null if they are missing
                if (key !== 'id') {
                    acc[key] = req.body.hasOwnProperty(key) ? req.body[key] : null;
                }
                return acc;
            }, {})
        };
    
        // Update the user in the array
        users[userIndex] = updatedUser;
    
        // Save to the file
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
            if (err) throw err;
            return res.json({status: "success", message: "User updated successfully with id: " + id});
        });
    });

module.exports = router;