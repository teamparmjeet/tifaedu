import dbConnect from "@/lib/dbConnect";
import QueryUpdateModel from "@/model/AuditLog";
import QueryModel from "@/model/Query"; // Import the QueryModel to update deadline

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

        // Fetch the existing audit document
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

        // Calculate tomorrow's date for the deadline
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Find changes between the existing document and the incoming data
        const changes = {};
        for (const key in data) {
            if (JSON.stringify(audit[key]) !== JSON.stringify(data[key])) {
                changes[key] = {
                    oldValue: audit[key],
                    newValue: data[key],
                };
            }
        }

        // If no changes are found, return a message stating no updates were necessary
        if (Object.keys(changes).length === 0) {
            return new Response(
                JSON.stringify({
                    message: "No changes detected.",
                    success: false,
                }),
                { status: 400 }
            );
        }

        // Add the change history with detailed information
        const historyEntry = {
            action: "update",
            stage: audit.stage?.toString() || "unknown",
            actionBy: data.actionby || "system", // Default to "system" if no actionby is provided
            actionDate: new Date(),
            changes: changes,
        };

        // Push the new history entry to the existing history
        await QueryUpdateModel.updateOne(
            { queryId: data.queryId },
            {
                $set: data, // Update the fields with the new data
                $push: { history: historyEntry }, // Push the latest history entry
            }
        );

        // Now update the deadline in the related QueryModel document
        await QueryModel.updateOne(
            { _id: data.queryId }, // Find the related QueryModel document
            {
                $set: { deadline: tomorrow.toISOString() }, // Update the deadline to tomorrow's date
            }
        );

        return new Response(
            JSON.stringify({
                message: "Audit updated successfully and deadline set to tomorrow!",
                success: true,
                auditid: data.queryId,
            }),
            { status: 200 }
        );

    } catch (error) {
        console.error("Error updating audit or deadline:", error);
        return new Response(
            JSON.stringify({
                message: "Error updating audit or deadline!",
                success: false,
            }),
            { status: 500 }
        );
    }
};
