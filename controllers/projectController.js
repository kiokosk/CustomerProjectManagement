const { Project, Customer } = require('../models');
const { Op } = require('sequelize');

// Get all projects (sorted by creation date, newest at the top)
const getProjects = async (req, res) => {
    try {
        const projects = await Project.findAll({
            order: [['createdAt', 'DESC']],
            include: {
                model: Customer, 
                attributes: ['name']
            }
        });
        res.status(200).json(projects);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a single project by ID
const getProject = async (req, res) => {
    const { id } = req.params;

    try {
        const project = await Project.findByPk(id, {
            include: {
                model: Customer,
                attributes: ['name']
            }
        });
        if (!project) {
            return res.status(404).json({ message: 'Project not found!' });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Create a new project
const createProject = async (req, res) => {
    const { name, description, customerId } = req.body;
    // Error handling for missing fields
    let emptyFields = [];
    if (!name) {
        emptyFields.push('name');
    }
    if (!description){
         emptyFields.push('description');
        }
    if (!customerId) {
        emptyFields.push('customerId');
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields!', emptyFields });
    }
    
    // Check if customerId exists
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
        return res.status(400).json({ error: 'Invalid customerId! No such customer exists.' });
    }
    
    // Check if project name already exists for any customer
    const existingProject = await Project.findOne({ 
        where: { name }
    });
    if (existingProject) {
        return res.status(400).json({ error: 'A project with this name already exists.' });
    }
    
    try {
        const project = await Project.create({ name, description, customerId });
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a project 
const deleteProject = async (req, res) => {
    const { id } = req.params;

    try {
        const project = await Project.findByPk(id); 
        if (!project) {
            return res.status(400).json({ message: 'Project not found!' });
        }
        await project.destroy(); 
        res.status(200).json({ message: 'Project deleted successfully!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Edit a project
const updateProject = async (req, res) => {
    const { id } = req.params;
    const { name, description, customerId } = req.body;
    try {
        const project = await Project.findByPk(id);
        if (!project) {
            return res.status(400).json({ error: 'Project not found!' });
        }
        
        // Check if the new name already exists for any project other than the current one
        const existingProject = await Project.findOne({
            where: {
                name,
                id: { [Op.ne]: id } 
            }
        });
        if (existingProject) {
            return res.status(400).json({ error: 'A project with this name already exists.' });
        }
        
        await project.update({ name, description, customerId });
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
module.exports = {
    getProjects,
    getProject,
    createProject,
    deleteProject,
    updateProject
};
