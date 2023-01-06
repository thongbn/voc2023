export const createConversationId = (sender, receiption) => {
    if(sender.id > receiption.id){
        return `${sender.id}_${receiption.id}`;
    }
    return `${receiption.id}_${sender.id}`;
}