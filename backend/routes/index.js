import express from 'express';
import joi from 'joi';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import Project from '../models/index.js'
import { authMiddleware } from '../middleware/auth.js'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const api = express.Router()
api.use(authMiddleware)

api.get('/projects', async (req, res) => {
    try {
        const data = await Project.find({}, { task: 0, __v: 0, updatedAt: 0 })
        return res.send(data)
    } catch (error) {
        return res.send(error)
    }
})

api.get('/project/:id', async (req, res) => {
    if (!req.params.id) res.status(422).send({ data: { error: true, message: 'Id is reaquire' } })
    try {
        const data = await Project.find({ _id: mongoose.Types.ObjectId(req.params.id) })
        return res.send(data)
    } catch (error) {
        return res.send(error)
    }
})

api.post('/project', async (req, res) => {

    // validate type 
    const project = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
        status: joi.string().valid('Planning', 'Active', 'Completed').optional(),
        startDate: joi.date().allow(null, '').optional(),
        endDate: joi.date().allow(null, '').optional(),
        links: joi.array().items(joi.object({
            name: joi.string().required(),
            url: joi.string().required()
        })).optional()
    })

    // validation
    const { error, value } = project.validate(req.body);
    if (error) return res.status(422).send(error)


    // insert data 
    try {
        const data = await new Project(value).save()
        res.send({ data })

    } catch (e) {
        if (e.code === 11000) {
            return res.status(422).send({ data: { error: true, message: 'title must be unique' } })
        } else {
            return res.status(500).send({ data: { error: true, message: 'server error' } })
        }
    }


})

api.put('/project/:id', async (req, res) => {
    // validate type 
    const project = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
        status: joi.string().valid('Planning', 'Active', 'Completed').optional(),
        startDate: joi.date().allow(null, '').optional(),
        endDate: joi.date().allow(null, '').optional(),
        links: joi.array().items(joi.object({
            name: joi.string().required(),
            url: joi.string().required()
        })).optional()
    })

    // // validation
    const { error, value } = project.validate(req.body);
    if (error) return res.status(422).send(error)

    Project.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { ...value }, { upsert: true }, (error, data) => {
        if (error) {
            res.send(error)
        } else {
            res.send(data)
        }
    })


})

api.delete('/project/:id', async (req, res) => {
    try {
        const data = await Project.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) })
        res.send(data)
    } catch (error) {
        res.send(error)
    }

})


export default api;