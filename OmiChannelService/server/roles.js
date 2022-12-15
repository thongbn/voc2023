import {USER_ROLES} from "./helper/appConst"

const {AFFILIATE, SALE} = USER_ROLES;

const roles = [
    {
        role: AFFILIATE,
        paths: [
            '/appointments/*',
            '/auth/*',
            '/dashboard/*',
            '/members/*',
            '/promotions/*',
            '/transactions/*',
        ]
    },
    {
        role: SALE,
        paths: [
            '/sale/*',
        ]
    }
];

export const getRole = (role) => {
    return roles[role];
};

export default roles;