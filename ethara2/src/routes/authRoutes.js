const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { signup, login } = require('../controllers/authController');
const { validate } = require('../middleware/validate');

const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('Admin', 'Member').optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);

module.exports = router;
