const router = require('express').Router();
const todoController = require('../controllers/todo-controller');

// Login
router.get('/login', todoController.getLoginPage);
router.post('/login', todoController.submitLogin);

// Register
router.get('/register', todoController.getRegisterPage);
router.post('/register', todoController.submitRegistration)


// Get and Create List
router.get('/list/:username', todoController.getTodoList);
router.post('/list/:username', todoController.createList);

// Delete List Item
router.get('/list/:username/delete/:listid', todoController.deleteListItem);

// Logout
router.get('/logout', todoController.logout);




module.exports = router;