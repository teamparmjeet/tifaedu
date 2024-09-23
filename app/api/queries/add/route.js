import dbConnect from "@/lib/dbConnect";
import QueryModel from "@/model/Query";

export async function POST(req, res) {
    await dbConnect();

    try {
        const query = await req.json();

        const newQuery = new QueryModel(query);

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