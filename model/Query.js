import mongoose, { Schema } from "mongoose";

const querySchema = new Schema({
    studentName: {
        type: String,
        required: true,
    },
    studentContact: {
        type: String,
        required: true,
    },
    courseInterest: {
        type: String,
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    branch: {
        type: String,
        required: true,
    },
    // Call handling stages
    callStage: {
        type: String,
        enum: ['new', 'RNR1', 'RNR2', 'RNR3', 'busy', 'call-back', 'auto-closed'],
        default: 'new',
    },
    // Connection status stage
    connectionStatus: {
        type: String,
        enum: ['not-connected1', 'not-connected2', 'not-connected3', 'connected', 'transferred'],
        default: 'not-connected1',
    },
    // Lead qualification stage
    leadStatus: {
        type: String,
        enum: ['wrong-lead', 'not-interested', 'interested', 'NPR1', 'NPR2', 'ready-to-join', 'enrolled', 'branch-visited', 'not-visited'],
        default: 'interested',
    },
    history: [
        {
            action: String,
            stage: String,
            actionBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
            actionDate: { type: Date, default: Date.now },
        },
    ],
    notes: {
        type: String,
    },
}, { timestamps: true });

const QueryModel =
    mongoose.models.Query || mongoose.model('Query', querySchema);
export default QueryModel;