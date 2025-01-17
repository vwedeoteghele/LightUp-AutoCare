const { model, Schema } = require('mongoose');

const InvoiceSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        default: 0,
    },
    clientId: {
        type: Number,
        required: true,
    },
    vehicleId: {
        type: Number,
        required: true,
    },
    billingAddress: {
        name: {
            type: String,
            default: 'ATB TECHSOFT',
        },
        address: {
            type: String,
            default: '8 CMD ROAD',
        },
        city: {
            type: String,
            default: 'IKOSI KETU ',
        },
        postalCode: {
            type: Number,
            default: 100248,
        },
        state: {
            type: String,
            default: 'LAGOS',
        },
    },
    dueDate: {
        type: Date,
        default: new Date(new Date().setDate(new Date().getDate() + 7)),
    },
    items: [
        {
            item: {
                type: String,
                required: true,
                default: 'Basic Service',
            },
            unit: {
                type: Number,
                required: true,
                default: 1,
            },
            rate: {
                type: Number,
                required: true,
                default: 1,
            },
            amount: {
                type: Number,
                min: [1, 'Amount too low'],
            },
        },
    ],
    // Model Required fields
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    timeStamp: {
        type: Number,
        required: true,
        default: () => Date.now(),
    },
    createdOn: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
    updatedOn: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
});

model('Invoice', InvoiceSchema);
