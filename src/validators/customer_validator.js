import expressValidator from 'express-validator';
import { PLANET_NAMES } from '../dataForValidation/constants.js';
const { body } = expressValidator;

class CustomerValidator {

    complete() {
        return [

            body('name').exists().withMessage('Requis').bail()
                .ltrim().withMessage('Vide est un nom invalide').bail()
                .notEmpty().withMessage('Le champ ne peut être vide').bail()
                .isAscii().withMessage('Caracters mu best in ASCII table').bail(),

            body('email').exists().withMessage('Requis').bail()
                .ltrim().withMessage('Vide est un nom invalide').bail()
                .notEmpty().withMessage('Le champ ne peut être vide').bail()
                .isAscii().withMessage('Caracters mu best in ASCII table').bail(),

            body('planet').exists().withMessage('Requis').bail()
                .ltrim().withMessage('Vide est un nom invalide').bail()
                .notEmpty().withMessage('Champ vide').bail()
                .isAscii().withMessage('Caracters must be in ASCII table').bail()
                .isIn(PLANET_NAMES).withMessage("Planet n'existe pas").bail(),

            body('coord.lat').exists().withMessage('Requis').bail()
                .notEmpty().withMessage('Champ vide').bail()
                .isFloat({ min: -1000, max: 1000 }).withMessage('Value must be between -1000 and 1000').bail(),

            body('coord.lon').exists().withMessage('Requis').bail()
                .notEmpty().withMessage('Champ vide').bail()
                .isFloat({ min: -1000, max: 1000 }).withMessage('Value must be between -1000 and 1000').bail(),

            body('phone').exists().withMessage('Requis').bail()
                .notEmpty().withMessage('Champ vide').bail()
                .isHexadecimal().withMessage('Must be hexadecimal value').bail()
                .isLength({ min: 16, max: 16 }).withMessage('Must be 16 characters long').bail(),

            body('birthday').exists().withMessage('Requis')
                .notEmpty().withMessage('Champ vide').bail()
                .isISO8601().toDate().withMessage('Must me date formet YYYY-MM--DD').bail()
        ]
    }
}

export default new CustomerValidator();