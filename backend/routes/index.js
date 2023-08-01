const express = require('express');
const router = express.Router();
const authController = require('../controller/authcontroller');
const blogController = require('../controller/blogcontroller');
const CommentController = require('../controller/commentcontroller');
const auth = require("../middlewares/auth")



//USER endpoints

//register
router.post('/register', authController.register)

//login
router.post('/login', authController.login)

// LOGOUT
router.post('/logout',auth, authController.logout)

// REFRESH
router.get('/refresh', authController.refresh)

// BLOG CONTROLLER

// CREATE
router.post('/blog', auth, blogController.create)

// GET ALL
router.get('/blog/all', auth, blogController.getAll)

// GET BY ID
router.get('/blog/:id', auth, blogController.getById)

// UPDATE
router.put('/blog', auth, blogController.update)

// DELETE
router.delete('/blog/:id', auth, blogController.delete)

// COMMENTS CONTROLLER

// CREATE COMMENT
router.post('/comments', auth, CommentController.createComment)


// GET COMMENTS BY ID
 router.get('/comments/:id', auth, CommentController.getById)




module.exports = router;