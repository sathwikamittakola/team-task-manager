const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { createTask, getTasks, updateTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const taskSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().optional().allow(''),
  assignedTo: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'valid object id').optional(),
  projectId: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'valid object id').required(),
  deadline: Joi.date().optional(),
  status: Joi.string().valid('Pending', 'In Progress', 'Completed').optional()
});

const statusSchema = Joi.object({
  status: Joi.string().valid('Pending', 'In Progress', 'Completed').required()
});

router.use(protect); // Protect all task routes

router.route('/')
  .get(getTasks)
  .post(validate(taskSchema), createTask);

router.route('/:id')
  .put(validate(statusSchema), updateTask);

module.exports = router;
