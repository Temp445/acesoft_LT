const express = require('express');
const { register, login, getAllUsers, updateUserRole } = require('../controllers/userController');
;

const router = express.Router();

// Register
router.post('/register', register);

// Login
router.post('/login', login);
//user list
router.get("/users", getAllUsers);
//edit role
router.put("/users/:userId/role", updateUserRole);


module.exports = router;
