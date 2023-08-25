import expressValidator from 'express-validator';
import { MONSTER_ANCESTORS, PLANET_NAMES } from '../dataForValidation/constants.js';
const { body } = expressValidator;

class PizzeriaValidator {

    complete() {
        return [

            body('chef.name').exists().withMessage('Requis').bail()
                .ltrim().withMessage('Vide est un nom invalide').bail()
                .notEmpty().withMessage('Le champ ne peut être vide').bail()
                .isAscii().withMessage('Caracters mu best in ASCII table').bail(),

            body('chef.ancestor').exists().withMessage('Requis').bail()
                .ltrim().withMessage('Vide est un nom invalide').bail()
                .notEmpty().withMessage('Le champ ne peut être vide').bail()
                .isAscii().withMessage('Caracters mu best in ASCII table').bail()
                .isIn(MONSTER_ANCESTORS).withMessage('Doit être un monstre ancètre').bail(),

            body('chef.speciality').exists().withMessage('Requis').bail()
                .ltrim().withMessage('Vide est un nom invalide').bail()
                .notEmpty().withMessage('Le champ ne peut être vide').bail()
                .isAscii().withMessage('Caracters mu best in ASCII table').bail()
                .isIn(PIZZA_TOPPINGS).withMessage("topping n'existe pas").bail(),
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
        ]
    }
}

export default new PizzeriaValidator();