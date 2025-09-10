const { body, param, validationResult } = require('express-validator');

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      statusCode: 400,
      errors: errors.array().map(e => ({ field: e.param, msg: e.msg }))
    });
  }
  next();
}

const isEmail = param('email').isEmail().withMessage('Invalid e-mail');

const participantRules = [
  body('participant.email')      .isEmail().withMessage('Invalid e-mail'),
  body('participant.firstname')  .isString().notEmpty(),
  body('participant.lastname')   .isString().notEmpty(),
  body('participant.dob')        .isISO8601({ strict: true }).withMessage('DOB must be a valid date YYYY-MM-DD'),

  body('work.companyname')       .isString().notEmpty(),
  body('work.salary')            .isNumeric().notEmpty(),
  body('work.currency')          .isString().isLength({ min: 3, max: 4 }).withMessage('Use 3 or 4-letter ISO code'),

  body('home.country')           .isString().notEmpty(),
  body('home.city')              .isString().notEmpty()
];


module.exports = { handleValidationErrors, participantRules, isEmail };