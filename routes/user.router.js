const router = require('express').Router()
const userController = require('../controller/user.controller')
const auth = require('../middlewares/auth.js')

router.post('/login', userController.loginUser)
router.post('/', userController.createUser)
router.get('/', userController.readUser)
router.put('/:id', auth, userController.updateUser)
router.delete('/:id', auth, userController.deleteUser)

module.exports = router