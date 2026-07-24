import { Schema, model } from 'mongoose';

const eventSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
            type: Date,
            required: true,
        },
        place: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        capacity: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const eventModel = model('event', eventSchema);
