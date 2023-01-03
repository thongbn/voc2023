import { PLATFORM_FB } from "../appConst";
import { createRawData } from "./RawService";

export const handleFacebookService = async (message) => {
    try{
        const data = JSON.parse(message);
        if (!data) {
            throw new Error("Parse data fail");
        }

        let objectId = 1;
        let objectType = "feed";
        const rawMessage = await createRawData(PLATFORM_FB, objectId, objectType, message);
        


    }catch(e){
        throw e;
    }
}