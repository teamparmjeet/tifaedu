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
    mongoose.models.Queries14 || mongoose.model('Queries14', querySchema);
export default QueryModel;
