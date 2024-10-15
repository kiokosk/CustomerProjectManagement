require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize'); 

const customerRoutes = require('./routes/customer'); 
const projectRoutes = require('./routes/project'); 


const lsapp = express();

// Middleware
lsapp.use(express.json()); 
lsapp.use(cors()); 

// Log requests
lsapp.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes
lsapp.use('/api/v1/customers', customerRoutes);
lsapp.use('/api/v1/projects', projectRoutes);

// Initialize Sequelize for MySQL connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
});

// Test DB connection and start the server
sequelize.authenticate()
    .then(() => {
        console.log('Database connected succefully...');

        
        const PORT = process.env.PORT
        lsapp.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });
