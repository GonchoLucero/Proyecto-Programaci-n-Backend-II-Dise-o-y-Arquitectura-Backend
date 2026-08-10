import { Schema, model } from 'mongoose';
import { USER_ROLES as ROLES } from '../utils/constants.js';
const userSchema = new Schema(
    {
        first_name: {
            type: String,
            required: true,
            trim: true,
        },
        last_name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ROLES,
            default: 'user',
        },
    },
    { timestamps: true }
);

userSchema.set('toJSON', {
    transform: (_doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
    },
});

export const userModel = model('user', userSchema);
