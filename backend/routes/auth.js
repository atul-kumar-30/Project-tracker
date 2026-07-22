import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';
import joi from 'joi';

const router = express.Router();

router.post('/signup', async (req, res) => {
    const schema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
        role: joi.string().valid('admin', 'manager', 'member').optional()
    });

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(422).send({ error: true, message: error.details[0].message });

    try {
        const existingUser = await User.findOne({ email: value.email });
        if (existingUser) return res.status(409).send({ error: true, message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(value.password, 10);
        
        const user = new User({
            name: value.name,
            email: value.email,
            password: hashedPassword,
            role: value.role || 'member'
        });

        await user.save();
        
        res.status(201).send({ data: { message: 'User created successfully', id: user._id } });
    } catch (e) {
        console.error("Signup error:", e);
        res.status(500).send({ error: true, message: e.message || 'Server error', stack: e.stack });
    }
});

router.post('/login', async (req, res) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(422).send({ error: true, message: error.details[0].message });

    try {
        const user = await User.findOne({ email: value.email });
        if (!user) return res.status(401).send({ error: true, message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(value.password, user.password);
        if (!isMatch) return res.status(401).send({ error: true, message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '1d' }
        );

        res.send({ 
            data: {
                token, 
                user: { id: user._id, name: user.name, email: user.email, role: user.role } 
            } 
        });
    } catch (e) {
        res.status(500).send({ error: true, message: 'Server error' });
    }
});

router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).send({ error: true, message: 'User not found' });
        res.send({ data: user });
    } catch (e) {
        res.status(500).send({ error: true, message: 'Server error' });
    }
});

router.get('/users', authMiddleware, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.send(users);
    } catch (e) {
        res.status(500).send({ error: true, message: 'Server error' });
    }
});

export default router;
