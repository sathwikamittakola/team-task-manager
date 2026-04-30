const Project = require('../models/Project');

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res, next) => {
  try {
    const { name, members } = req.body;

    const project = await Project.create({
      name,
      members: [req.user._id], // Creator is the first member
      createdBy: req.user._id
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    let projects;

    if (req.user.role === 'Admin') {
      // Admin sees all projects
      projects = await Project.find().populate('createdBy', 'name email').populate('members', 'name email');
    } else {
      // Member sees only projects they belong to
      projects = await Project.find({ members: req.user._id }).populate('createdBy', 'name email').populate('members', 'name email');
    }

    res.json(projects);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects
};
