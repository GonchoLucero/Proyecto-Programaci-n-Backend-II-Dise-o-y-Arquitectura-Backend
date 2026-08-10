import { Schema, model, Types } from 'mongoose';
import crypto from 'crypto';
import { TICKET_STATUSES } from '../utils/constants.js';

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
        status: {
            type: String,
            enum: TICKET_STATUSES,
            default: 'confirmed',
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        reservationCode: {
            type: String,
            required: true,
            unique: true,
            default: () => crypto.randomUUID(),
        },
        cancelledAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export const ticketModel = model('ticket', ticketSchema);
