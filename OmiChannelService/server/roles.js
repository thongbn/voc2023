//GET FROM CONFIG
const roles = {
    sAdmin: {

    },
    admin: {

    },
    aeonSupport:{

    },
    support:{

    }
};

export const getRole = (role) => {
    return roles[role];
};

export default roles;