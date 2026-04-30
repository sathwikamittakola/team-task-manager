const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { createProject, getProjects } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { validate } = require('../middleware/validate');

const projectSchema = Joi.object({
  name: Joi.string().max(100).required(),
  members: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'valid object id')).optional()
});

router.use(protect); // Protect all project routes

router.route('/')
  .get(getProjects)
  .post(authorize('Admin'), validate(projectSchema), createProject);

module.exports = router;
