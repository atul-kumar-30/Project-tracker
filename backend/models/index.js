// import { number, string } from "joi";
import mongoose from "mongoose";

const project = new mongoose.Schema({
    title: {
        type: String,
        unique: true
    },
    description: String,
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['Planning', 'Active', 'Completed'],
        default: 'Planning'
    },
    startDate: {
        type: Date,
        default: null
    },
    endDate: {
        type: Date,
        default: null
    },
    links: [{
        name: String,
        url: String
    }]
}, { timestamps: true })


export default mongoose.model('Project', project);