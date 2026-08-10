import { Schema, model, Types } from 'mongoose';
import { EVENT_STATUSES } from '../utils/constants.js';

const eventSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
            type: Date,
            required: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        capacity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: EVENT_STATUSES,
            default: 'draft',
        },
        organizer: {
            type: Types.ObjectId,
            ref: 'user',
            required: true,
        },
    },
    { timestamps: true }
);

export const eventModel = model('event', eventSchema);
