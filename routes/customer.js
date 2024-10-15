const express = require('express');
const {
    getCustomers,
    getCustomer,
    createCustomer,
    deleteCustomer,
    updateCustomer
} = require('../controllers/customerController'); 

const router = express.Router();

// Get all customers
router.get('/', getCustomers);

// Get a single customer 
router.get('/:id', getCustomer);

// Create a new customer
router.post('/', createCustomer);

// Delete a customer
router.delete('/:id', deleteCustomer);

// Update a customer
router.put('/:id', updateCustomer);

module.exports = router;
