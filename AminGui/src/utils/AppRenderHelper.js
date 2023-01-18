import {PLATFORMS} from "../configs/appConfig";
import {RiFileUnknowFill} from "react-icons/ri";
import React from "react";

export const renderPlatformIcon = (platform) => {
    try{
        return PLATFORMS[platform].icon;
    }catch (e) {
        return <RiFileUnknowFill className="remix-icon"/>
    }
};