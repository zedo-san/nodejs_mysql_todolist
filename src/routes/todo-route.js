const router = require('express').Router();
const todoController = require('../controllers/todo-controller');

// Login
router.get('/login', todoController.getLoginPage);
router.post('/login', todoController.submitLogin);

// Register
router.get('/register', todoController.getRegisterPage);
router.post('/register', todoController.submitRegistration)


// List
router.get('/list/:id', todoController.getTodoList);
router.post('/list/:id', todoController.createList);





module.exports = router;