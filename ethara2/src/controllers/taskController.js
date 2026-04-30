const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, projectId, deadline } = req.body;

    // Optional: check if project exists and user is admin or belongs to project
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      return next(new Error('Project not found'));
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      projectId,
      deadline
    });

    await task.populate([
      { path: 'projectId', select: 'name' },
      { path: 'assignedTo', select: 'name email' }
    ]);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    let query = {};

    // Filter by role
    if (req.user.role !== 'Admin') {
      query.assignedTo = req.user._id;
    }

    // Filter by projectId if provided
    if (projectId) {
      query.projectId = projectId;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'name');

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { status } = req.body;
    let task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      return next(new Error('Task not found'));
    }

    // Check if user is admin or task is assigned to them
    if (req.user.role !== 'Admin' && task.assignedTo.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not authorized to update this task'));
    }

    task.status = status || task.status;
    await task.save();

    res.json(task);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask
};
