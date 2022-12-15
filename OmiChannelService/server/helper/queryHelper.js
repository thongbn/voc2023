export const paginationQuery = (queryObj, req) => {
    let {limit, page} = req.query;
    if (!limit) {
        limit = 20;
    }
    if (!page) {
        page = 1;
    }
    const offset = (page - 1) * limit;
    return {
        ...queryObj,
        limit: limit + 1,
        offset
    }
};

export const paginationDataResult = (dataResult, req) => {
    let {limit, page} = req.query;
    if (!limit || limit <= 0) {
        limit = 20;
    }
    if (!page || page <= 0) {
        page = 1;
    }

    return {
        data: dataResult,
        pagination: {
            limit: limit,
            page: page,
        }
    }
};
