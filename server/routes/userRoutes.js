const express = require('express');
const router = express.Router();
const {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

router.route('/').get(getUsers).post(addUser);
router.route('/:id').put(updateUser).delete(deleteUser);

module.exports = router;
