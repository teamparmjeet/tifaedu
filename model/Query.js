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
        enum: ['new', 'RNR1', 'RNR2', 'RNR3', 'busy', 'call-back', 'call-no-lifting', 'auto-closed'],
        default: 'new',
    },
    // Connection status stage
    connectionStatus: {
        type: String,
        enum: ['not-connected1', 'not-connected2', 'not-connected3', 'connected', 'transferred']
    },
    // Lead qualification stage
    leadStatus: {
        type: String,
        enum: [
            'wrong-lead',               // Lead not useful (wrong number or job seeker)
            'not-interested',            // Lead not interested in the course
            'interested',                // Lead is interested in the course
            'NPR1',                      // No Proper Response 1st follow-up
            'NPR2',                      // No Proper Response 2nd follow-up
            'ready-to-join',             // Lead is ready to join the course
            'enrolled',                  // Lead has enrolled in the course
            'branch-visited',            // Visited the branch and interested
            'not-visited',               // Did not visit the branch
            'visited-not-interested',    // Visited the branch but not interested
            'follow-up1',                // First follow-up after branch visit
            'follow-up2',                // Second follow-up after branch visit
            'lead-closed'                // Lead closed after follow-ups or disinterest
        ],
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