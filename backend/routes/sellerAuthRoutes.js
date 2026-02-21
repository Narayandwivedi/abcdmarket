const express = require('express');
const {
  signupSeller,
  loginSeller,
  logoutSeller,
  getSellerMe,
} = require('../controllers/sellerAuthController');

const router = express.Router();

router.post('/signup', signupSeller);
router.post('/login', loginSeller);
router.post('/logout', logoutSeller);
router.get('/me', getSellerMe);

module.exports = router;
