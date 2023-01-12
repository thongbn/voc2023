import ApiHelper from "../utils/ApiHelper";

export const searchTransactionLogs = async (page, query = {}) => {
    try {
        console.log(query);
        //Preload query
        const formatQuery = {
            id: query.id,
            appointmentId: query.appointmentId,
            paidStatus: query.paidStatus,
            orderId: query.orderId,
            type: query.type,
            page
        };
        console.log(formatQuery);
        return await ApiHelper().get("/transactions/logs", {
            params: formatQuery
        });
    } catch (e) {
        throw e;
    }
};