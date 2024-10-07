import dbConnect from "@/lib/dbConnect";
import QueryUpdateModel from "@/model/AuditLog";

export const PATCH = async (request) => {
    await dbConnect();

    try {
        const data = await request.json();

        // Basic validation for queryId
        if (!data.queryId) {
            return new Response(
                JSON.stringify({
                    message: "queryId is required",
                    success: false,
                }),
                { status: 400 }
            );
        }

        // Check if the audit exists in the database
        const audit = await QueryUpdateModel.findOne({ queryId: data.queryId });

        if (!audit) {
            return new Response(
                JSON.stringify({
                    message: "Received invalid audit id!",
                    success: false,
                }),
                { status: 404 }
            );
        }

        // Find changed fields
        const changes = {};
        for (const key in data) {
            if (audit[key] !== undefined && audit[key] !== data[key]) {
                changes[key] = {
                    oldValue: audit[key],
                    newValue: data[key],
                };
            }
        }

        // If there are changes, add them to the history
        if (Object.keys(changes).length > 0) {
            audit.history.push({
                action: "update",
                stage: audit.stage.toString(),
                actionBy: data.actionby || "system", // Assuming actionby is sent from client or set default
                actionDate: new Date(),
                changes: changes,
            });
        }

        // Update the audit document with the new data and history
        await QueryUpdateModel.updateOne(
            { queryId: data.queryId },
            {
                $set: data, // Update the fields in the data object
                $push: { history: audit.history[audit.history.length - 1] }, // Push the latest history entry only once
            }
        );

        return new Response(
            JSON.stringify({
                message: "Audit updated successfully!",
                success: true,
                auditid: data.queryId,
            }),
            { status: 200 }
        );

    } catch (error) {
        console.error("Error on updating audit:", error);
        return new Response(
            JSON.stringify({
                message: "Error on updating audit!",
                success: false,
            }),
            { status: 500 }
        );
    }
};
