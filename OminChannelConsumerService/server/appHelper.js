export const createConversationId = (sender, receiver) => {
    if(sender.id > receiver.id){
        return `${sender.id}_${receiver.id}`;
    }
    return `${receiver.id}_${sender.id}`;
}