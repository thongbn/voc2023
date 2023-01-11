export const handleChangeItem = async (id, time, changeItem) => {
    try {
        const {field, value} = changeItem;
        switch (field) {
            case "comments": {
                await handleComment(id, time, value);
                break;
            }
            default:
                console.log(`handleChangeItem | field: ${field} not supported`);
                break;
        }
    } catch (e) {
        throw e;
    }
};

const handleComment = async (id, time, value) => {
    // const {from, media, id, parent_id, text} = value;
    //TODO handle ig comment
};
