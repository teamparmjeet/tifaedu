import dbConnect from "@/lib/dbConnect";
import QueryModel from "@/model/Query";

export async function POST(req, res) {
  await dbConnect();

  try {
    const queries = await req.json(); // Expect an array of queries

    if (!Array.isArray(queries)) {
      return new Response(JSON.stringify({
        success: false,
        message: "Data should be an array of queries",
      }), { status: 400 });
    }

    // Insert multiple documents at once using insertMany
    const result = await QueryModel.insertMany(queries);

    return new Response(JSON.stringify({
      message: `${result.length} Queries Added Successfully`,
      success: true,
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: error.message,
    }), { status: 500 });
  }
}
