const { Customer } = require('../models'); 

// Get all customers (sorted by creation date, newest at the top)
const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json(customers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a single customer
const getCustomer = async (req, res) => {
    const { id } = req.params;

    try {
        const customer = await Customer.findByPk(id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found!' });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Create a new customer
const createCustomer = async (req, res) => {
    const { name, email, address } = req.body;

    // Error handling for missing fields
    let emptyFields = [];
    if (!name){
         emptyFields.push('name');
        }
    if (!email){
         emptyFields.push('email');
        }
    if (!address) {
        emptyFields.push('address');
    }

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields!', emptyFields });
    }

    try {
            // Check if email already exists
        const existingCustomer = await Customer.findOne({ where: { email } });
        if (existingCustomer) {
        return res.status(400).json({ error: 'Customer with that email already eists!' });
        }

        const customer = await Customer.create({ name, email, address });
        res.status(200).json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a customer
const deleteCustomer = async (req, res) => {
    const { id } = req.params;

    try {
        const customer = await Customer.findByPk(id); 
        if (!customer) {
            return res.status(400).json({ message: 'Customer not found!' });
        }
        await customer.destroy();
        res.status(200).json({ message: 'Customer deleted successfully!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Edit a customer
const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { name, email, address } = req.body;

    try {

        const customer = await Customer.findByPk(id);
        if (!customer) {
            return res.status(400).json({ message: 'Customer not found!' });
        }

        // Check if the email is changing and if the new email belongs to another customer
        if (email !== customer.email) {
            const emailInUse = await Customer.findOne({ where: { email } });

            // If the email is found and belongs to another customer
            if (emailInUse && emailInUse.id !== customer.id) {
            return res.status(400).json({ error: 'Email is already in use by another customer!' });
            }
        }

        await customer.update({ name, email, address });
        res.status(200).json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getCustomers,
    getCustomer,
    createCustomer,
    deleteCustomer,
    updateCustomer
};
