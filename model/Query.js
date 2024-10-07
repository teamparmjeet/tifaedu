import mongoose, { Schema } from "mongoose";

const querySchema = new Schema({
    userid: {
        type: String,
        required: true,
        default: "null"
    },
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

    autoclosed: {
        type: String,
        enum: ["open", "close"],
        default: "open"
    },
    addmission:{
        type:Boolean,
        default:false
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
    mongoose.models.Queries12 || mongoose.model('Queries12', querySchema);
export default QueryModel;
