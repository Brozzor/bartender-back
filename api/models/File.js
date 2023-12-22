module.exports = {
    attributes: {
        filename: {
            type: 'string',
            required: true
        },
        slug: {
            type: 'string',
        },
        type: {
            type: 'string',
            required: true
        },
        size: {
            type: 'number',
            required: true
        },
        fileData: {
            type: 'string',
            allowNull : true
        },
    },
    beforeCreate: function(values, next) {
        if (values.filename.includes('.')) {
            values.slug = values.filename.split('.')[0].toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substring(2, 15);
        } else {
            values.slug = values.filename.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substring(2, 15);
        }
        next();
    }
};

