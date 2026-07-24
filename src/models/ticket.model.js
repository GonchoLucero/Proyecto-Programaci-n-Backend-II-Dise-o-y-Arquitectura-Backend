import { Schema, model, Types } from 'mongoose';

const ticketSchema = new Schema(
    {
        user: {
            type: Types.ObjectId,
            ref: 'user',
            required: true,
        },
        event: {
            type: Types.ObjectId,
            ref: 'event',
            required: true,
        },
    },
    { timestamps: true }
);

export const ticketModel = model('ticket', ticketSchema);
