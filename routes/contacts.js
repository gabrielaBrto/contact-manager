const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');

/**
 * @route GET api/contacts
 * @desc List contacts
 * @access Public
 */
router.get('/', auth, async (req, res) => { 
    try {
        const contacts = await Contact.find({user: req.user.id}).sort({ date: -1 });
        res.json(contacts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
 });

/**
 * @route POST api/contacts
 * @desc Create contact
 * @access Public
 */
router.post('/', [
    auth,
    [
        check('name', 'Name is required').not().isEmpty()
    ]
], async (req, res) => { 
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
        const contact = new Contact({
            name,
            email,
            phone,
            type,
            user: req.user.id
        })

        await contact.save();
        res.json({ contact })
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
 });

/**
 * @route PUT api/contacts/:id
 * @desc Update contact
 * @access Public
 */
router.put('/:id', auth, async (req, res) => { 
    const { name, email, phone, type } = req.body;

    //BUILD CONTACT OBJECT
    const contactFields = {};
    if (name) contactFields.name = name;
    if (email) contactFields.email = email;
    if (phone) contactFields.phone = phone;
    if (type) contactFields.type = type;

    try {
        let contact = await Contact.findById(req.params.id);

        if(!contact) return res.status(404).json({ msg: 'Contact nor found' });

        //VERIFY IF CONTATC BELONGS TO CURRENT USER
        if(contact.user.toString() !== req.user.id){
            return res.status(401).json({ msg: 'Not authorized' });
        }

        contact = await Contact.findByIdAndUpdate(req.params.id, 
            { $set: contactFields },
            {new: true});

        res.json(contact);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
 });

/**
 * @route DELETE api/contacts/:id
 * @desc Delete contact
 * @access Public
 */
router.delete('/:id', auth, async (req, res) => { 
    try {
        let contact = await Contact.findById(req.params.id);

        if(!contact) return res.status(404).json({ msg: 'Contact nor found' });

        //VERIFY IF CONTATC BELONGS TO CURRENT USER
        if(contact.user.toString() !== req.user.id){
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Contact.findByIdAndRemove(req.params.id);
                    
        res.json({ msg: 'Contact removed' });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
 });


module.exports = router;