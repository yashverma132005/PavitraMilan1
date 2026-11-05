import { body, param, query, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const mapped = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));
    console.error('[Validation Error]', JSON.stringify(mapped, null, 2));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: mapped,
    });
  }
  next();
};

export const validateRegistration = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  handleValidationErrors,
];

export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors,
];

export const validateProfileCreate = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('gender')
    .isIn(['MALE', 'FEMALE', 'OTHER'])
    .withMessage('Gender must be MALE, FEMALE, or OTHER'),
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  body('maritalStatus')
    .isIn(['NEVER_MARRIED', 'DIVORCED', 'WIDOWED', 'AWAITING_DIVORCE'])
    .withMessage('Invalid marital status'),
  body('height')
    .optional({ values: 'falsy' })
    .toFloat()
    .isFloat({ min: 100, max: 250 })
    .withMessage('Height must be between 100 and 250 cm'),
  body('weight')
    .optional({ values: 'falsy' })
    .toFloat()
    .isFloat({ min: 30, max: 200 })
    .withMessage('Weight must be between 30 and 200 kg'),
  body('religion')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 50 })
    .withMessage('Religion must be at most 50 characters'),
  body('city')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 100 })
    .withMessage('City must be at most 100 characters'),
  body('phone')
    .optional({ values: 'falsy' })
    .trim()
    .custom((value) => /^\+?[0-9\s().-]{8,20}$/.test(value) && value.replace(/\D/g, '').length >= 8)
    .withMessage('Please provide a valid WhatsApp number including country code'),
  handleValidationErrors,
];

export const validateProfileUpdate = [
  body('fullName')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('gender')
    .optional({ values: 'falsy' })
    .isIn(['MALE', 'FEMALE', 'OTHER'])
    .withMessage('Gender must be MALE, FEMALE, or OTHER'),
  body('dateOfBirth')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  body('maritalStatus')
    .optional({ values: 'falsy' })
    .isIn(['NEVER_MARRIED', 'DIVORCED', 'WIDOWED', 'AWAITING_DIVORCE'])
    .withMessage('Invalid marital status'),
  body('height')
    .optional({ values: 'falsy' })
    .toFloat()
    .isFloat({ min: 100, max: 250 })
    .withMessage('Height must be between 100 and 250 cm'),
  body('weight')
    .optional({ values: 'falsy' })
    .toFloat()
    .isFloat({ min: 30, max: 200 })
    .withMessage('Weight must be between 30 and 200 kg'),
  body('phone')
    .optional({ values: 'falsy' })
    .trim()
    .custom((value) => /^\+?[0-9\s().-]{8,20}$/.test(value) && value.replace(/\D/g, '').length >= 8)
    .withMessage('Please provide a valid WhatsApp number including country code'),
  handleValidationErrors,
];

export const validateInterest = [
  param('receiverId')
    .isUUID()
    .withMessage('Invalid receiver ID'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Message must be at most 500 characters'),
  handleValidationErrors,
];

export const validateMessage = [
  body('receiverId')
    .isUUID()
    .withMessage('Invalid receiver ID'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ max: 2000 })
    .withMessage('Message must be at most 2000 characters'),
  handleValidationErrors,
];

export const validateReport = [
  body('reportedId')
    .isUUID()
    .withMessage('Invalid user ID'),
  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Reason is required')
    .isLength({ max: 200 })
    .withMessage('Reason must be at most 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be at most 1000 characters'),
  handleValidationErrors,
];
