import dbConnect from "@/lib/dbConnect";
import QueryModel from "@/model/Query";

export async function POST(req, res) {
    await dbConnect();

    try {
        const { studentName, studentContact, courseInterest, branch, assignedTo, notes } = await req.json();

        const newQuery = new QueryModel({
            studentName,
            studentContact,
            courseInterest,
            branch,
            assignedTo,  // This could be optional if you want to assign later
            notes,       // Optional notes field
        });

        await newQuery.save();
        return Response.json({
            message: "Query Added Succesfully",
            success: true 
        }, { status: 200 });
    } catch (error) {
        return Response.json({
            success: false, message: error.message
        })
    }

}