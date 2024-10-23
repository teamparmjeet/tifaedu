import mongoose, { Schema } from "mongoose";

const ReferenceSchema = new Schema(

    {
        referencename: {
            type: String,
            required: true
        },

        defaultdata: { type: String, required: true, default: "reference" }

    },
    { timestamps: true }
);

const ReferenceModel =
    mongoose.models.refernce1 || mongoose.model("refernce1", ReferenceSchema);

export default ReferenceModel