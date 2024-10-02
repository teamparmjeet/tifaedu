import mongoose, { Schema } from "mongoose";

const querySchema = new Schema({
    studentName: {
        type: String,
        required: true,
    },
    studentContact: {
        phoneNumber: { type: String, required: true },
        address: { type: String, required: true }
    },
    courseInterest: {
        type: String,
        required: true,
    },
    deadline: {
        type: String,
        required: true
    },
    assignedTo: {
        type: String,
        default: "Not-Assigned",
        required: true,
    },
    branch: {
        type: String,
        required: true,
    },
    // Call handling stages
    callStage: {
        type: String,
        enum: ['new', 'busy', 'call-back', 'RNR1', 'RNR2', 'RNR3', 'auto-closed'],
        required: true,
        default: 'new',
    },
    // Connection status stage
    connectionStatus: {
        type: String,
        enum: ['not-connected1', 'not-connected2', 'not-connected3', 'connected', 'transferred'],
        required: true,
        default: 'not-connected1',
    },
    // Lead qualification stage
    leadStatus: {
        type: String,
        enum: ['wrong-lead', 'not-interested', 'interested', 'NPR1', 'NPR2', 'ready-to-join', 'enrolled', 'branch-visited', 'not-visited'],
        required: true,
        default: 'interested',
    },
    history: [
        {
            action: String,
            stage: String,
            actionBy: String,
            actionDate: { type: Date, default: Date.now },
            changes: {
                type: Map,
                of: {
                    oldValue: Schema.Types.Mixed,
                    newValue: Schema.Types.Mixed,
                },
            },
        },
    ],
    autoclosed: {
        type: String,
        enum: ["open", "close"],
        default: "open"
    },
    notes: {
        type: String,
    },
    defaultdata: { 
        type: String, 
        required: true, 
        default: "query" 
    }
}, { timestamps: true });

const QueryModel =
    mongoose.models.Queries9 || mongoose.model('Queries9', querySchema);
export default QueryModel;
