import dbConnect from "@/lib/dbConnect";
import QueryModel from "@/model/Query";

export const GET = async (request, context) => {
    await dbConnect();

    try {
        const id = context.params.id;
        const { stage, action } = request.json();

        const query = await QueryModel.findById(id);

        if (!query) {
            return Response.json(
                {
                    message: "Query not found!",
                    success: false,
                },
                { status: 404 }
            );
        }

        if (stage === 'callStage') {
            handleCallStage(query, action);
        } else if (stage === 'connectionStatus') {
            handleConnectionStatus(query, action);
        } else if (stage === 'leadStatus') {
            handleLeadStatus(query, action);
        } else {
            return Response({ success: false, message: 'Invalid stage' }, { status: 400 });
        }

        // Save updated query
        query.history.push({
            action: `Stage: ${stage} updated to ${action}`,
            actionBy: request.Admin._id,
        });
        await query.save();

        return Response.json(
            { success: true, query },
            { status: 200 }
        )



    } catch (error) {
        return Response.json(
            {
                message: "Something Goes Wrong With Process",
                success: false,
            }, { status: 404 }
        )
    }




}

const handleCallStage = (query, action) => {
    const allowedCallStages = ['new', 'RNR1', 'RNR2', 'RNR3', 'busy', 'call-back', 'call-no-lifting', 'auto-closed'];

    if (!allowedCallStages.includes(action)) {
        throw new Error('Invalid call stage action');
    }

    switch (query.callStage) {
        case 'new':
            if (action === 'RNR1') query.callStage = 'RNR1';
            break;
        case 'RNR1':
            if (action === 'RNR2') query.callStage = 'RNR2';
            break;
        case 'RNR2':
            if (action === 'RNR3') query.callStage = 'RNR3';
            break;
        case 'RNR3':
            if (action === 'auto-closed') {
                query.callStage = 'auto-closed';
                query.status = 'spam'; // Auto-close leads to spam status
            }
            break;
        default:
            if (action === 'call-back') {
                query.callStage = 'call-back';
            } else if (action === 'busy') {
                query.callStage = 'busy';
            } else if (action === 'call-no-lifting') {
                query.callStage = 'call-no-lifting';
            } else {
                throw new Error('Invalid call stage transition');
            }
    }
};

const handleConnectionStatus = (query, action) => {
    const allowedConnectionStages = ['not-connected1', 'not-connected2', 'not-connected3', 'connected', 'transferred'];

    if (!allowedConnectionStages.includes(action)) {
        throw new Error('Invalid connection status action');
    }

    switch (query.connectionStatus) {
        case 'not-connected1':
            if (action === 'not-connected2') query.connectionStatus = 'not-connected2';
            break;
        case 'not-connected2':
            if (action === 'not-connected3') query.connectionStatus = 'not-connected3';
            break;
        case 'not-connected3':
            if (action === 'transferred') {
                query.connectionStatus = 'transferred'; // Auto-transfer after 3 attempts
                // Implement logic for transferring the query
            }
            break;
        default:
            if (action === 'connected') {
                query.connectionStatus = 'connected';
            } else {
                throw new Error('Invalid connection status transition');
            }
    }
};

const handleLeadStatus = (query, action) => {
    const allowedLeadStatuses = [
        'wrong-lead', 'not-interested', 'interested', 'NPR1', 'NPR2', 
        'ready-to-join', 'enrolled', 'branch-visited', 'not-visited'
    ];

    if (!allowedLeadStatuses.includes(action)) {
        throw new Error('Invalid lead status action');
    }

    switch (action) {
        case 'wrong-lead':
        case 'not-interested':
        case 'interested':
        case 'NPR1':
        case 'NPR2':
        case 'ready-to-join':
        case 'enrolled':
        case 'branch-visited':
        case 'not-visited':
            query.leadStatus = action;
            break;
        default:
            throw new Error('Invalid lead status transition');
    }
};