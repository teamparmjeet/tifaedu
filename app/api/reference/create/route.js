import dbConnect from "@/lib/dbConnect";
import ReferenceModel from "@/model/Reference";

export async function POST(req, res) {
    await dbConnect();

    try {
        const reference = await req.json();
        const newreference = new ReferenceModel(reference);
        await newreference.save();

        return Response.json({
            message: "Reference Register",
            success: true,
            data: { id: newreference._id }
        }, { status: 200 })
    } catch (error) {
        console.log(error)
        return Response.json({
            message: "error in Reference Registeration",
            success: false
        }, { status: 500 })
    }
}