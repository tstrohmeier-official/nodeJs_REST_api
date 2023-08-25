import expressValidator from 'express-validator';
import { PIZZA_SIZES, PIZZA_TOPPINGS, PLANET_NAMES } from '../dataForValidation/constants.js';
const { body } = expressValidator;

class OrderValidator {

    complete() {
        return [

            body('subTotal').exists().withMessage('Requis').bail(),
            body('taxeRates').exists().withMessage('Requis').bail(),
            body('taxes').exists().withMessage('Requis').bail(),
            body('total').exists().withMessage('Requis').bail(),
            body('href').exists().withMessage('Requis').bail(),
            body('customer').exists().withMessage('Requis').bail(),
            body('pizzeria').exists().withMessage('Requis').bail(),

            body('pizzas.topping').exists().withMessage('Requis').bail()
                .ltrim().withMessage('Vide est un nom invalide').bail()
                .notEmpty().withMessage('Champ vide').bail()
                .isAscii().withMessage('Caracters must be in ASCII table').bail()
                .isIn(PIZZA_TOPPINGS).withMessage("topping n'existe pas").bail(),

            body('pizzas.price').exists().withMessage('Requis').bail(),
          
            body('pizzas.size').exists().withMessage('Requis').bail()
            .ltrim().withMessage('Vide est un nom invalide').bail()
            .notEmpty().withMessage('Champ vide').bail()
            .isAscii().withMessage('Caracters must be in ASCII table').bail()
            .isIn(PIZZA_SIZES).withMessage("Size n'existe pas").bail(),

            body('orderDate').exists().withMessage('Requis')
                .notEmpty().withMessage('Champ vide').bail()
                .isISO8601().toDate().withMessage('Must me date formet YYYY-MM--DD').bail()

      ]
    }
}

export default new OrderValidator();