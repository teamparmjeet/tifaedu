import dbConnect from "@/lib/dbConnect";
import QueryModel from "@/model/Query";

export const GET = async (request,context) => {
    await dbConnect();
    const branchname = context.params.branchname;

    try {
        const fetch = await QueryModel.find({ branch: branchname });
        return Response.json(
            {
                message: "All data fetched!",
                success: true,
                fetch,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error on getting data list:", error);
        return Response.json(
            {
                message: "Error on getting data list!",
                success: false,
            },
            { status: 500 }
        );
    }
};
