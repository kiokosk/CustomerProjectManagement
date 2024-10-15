const express = require('express');
const {
    getProjects,
    getProject,
    createProject,
    deleteProject,
    updateProject
} = require('../controllers/projectController'); 

const router = express.Router();

// Get all projects
router.get('/', getProjects);

// Get a single project
router.get('/:id', getProject);

// Create a new project
router.post('/', createProject);

// Delete a project
router.delete('/:id', deleteProject);

// Update a project
router.put('/:id', updateProject);

module.exports = router;
