const Joi = require('@hapi/joi');

module.exports = Joi.object({
    id: Joi.number().min(1).max(Number.MAX_SAFE_INTEGER),
    name: Joi.string().required().min(3).max(30),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    telephone: Joi.number().required(),
});
