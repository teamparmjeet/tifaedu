import mongoose, { Schema } from "mongoose";

const querySchema = new Schema({
    userid: {
        type: String,
        required: true,
        default: "null"
    },
    referenceid: {
        type: String,
        required: true,
        default: "null"
    },

    demo: {
        type: Boolean,
        default: false
    },


    studentName: {
        type: String,
        required: true,
    },
    studentContact: {
        phoneNumber: { type: String, required: true },
        whatsappNumber: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
    },



    // New ---
    qualification: {
        type: String,
        required: true,
    },
    profession: {
        type: String,
        enum: ["Student", "Working"],
        required: true,
    },
    professiontype: {
        type: String,
        required: true,
        default: "null"

    },

    reference_name: {
        type: String,
        required: true,
        default: "null"
    },
    // ---




    courseInterest: {
        type: String,
        required: true,
    },
    deadline: {
        type: String,
        required: true
    },
    lastDeadline: {
        type: String,
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
    addmission: {
        type: Boolean,
        default: false
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

querySchema.pre('save', function (next) {
    // Check if deadline has been modified
    if (this.isModified('deadline')) {
        // Set lastDeadline to today's date
        this.lastDeadline = new Date(); // Store today's date in lastDeadline
    }
    next();
});

const QueryModel =
    mongoose.models.Queries20 || mongoose.model('Queries20', querySchema);
export default QueryModel;
