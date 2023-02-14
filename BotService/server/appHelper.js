export const createConversationId = (sender, receiver) => {
    if (sender.id > receiver.id) {
        return `${sender.id}_${receiver.id}`;
    }
    return `${receiver.id}_${sender.id}`;
};

/**
 *
 * @param {string} text
 * @returns
 */
export const viToSlug = (text) => {
    let slug;

    slug = text.toLowerCase();

    slug = slug.replace(/[áàảạãăắằẳẵặâấầẩẫậ]/gi, 'a');
    slug = slug.replace(/[éèẻẽẹêếềểễệ]/gi, 'e');
    slug = slug.replace(/[iíìỉĩị]/gi, 'i');
    slug = slug.replace(/[óòỏõọôốồổỗộơớờởỡợ]/gi, 'o');
    slug = slug.replace(/[úùủũụưứừửữự]/gi, 'u');
    slug = slug.replace(/[ýỳỷỹỵ]/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');

    slug = slug.replace(/[`~!@#|$%^&*()+=,.\/?><'":;_]/gi, '');

    slug = slug.replace(/\-\-\-\-\-/gi, ' ');
    slug = slug.replace(/\-\-\-\-/gi, ' ');
    slug = slug.replace(/\-\-\-/gi, ' ');
    slug = slug.replace(/\-\-/gi, ' ');

    return slug;
};

export const delayTimeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const isAbsoluteUrl = (url) => {
    let reg = new RegExp('^(?:[a-z]+:)?//', 'i');
    return reg.test(url);
};