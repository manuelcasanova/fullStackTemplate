const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
// const ROLES_LIST = require('../../config/roles_list');
// const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
  .get(
    // verifyRoles(ROLES_LIST.Admin), 
    usersController.getAllUsers)

    router.route('/:user_id')
    .get((req, res) => {
      const { user_id } = req.params;
      console.log("Received request for user ID:", user_id);
      usersController.getUserById(req, res);
    });

module.exports = router;