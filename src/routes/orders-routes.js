import express from 'express';
import paginate from 'express-paginate';
import HttpError from 'http-errors';
import orderRepository from '../repositories/orders-repository.js';
import customerRepository from '../repositories/customers-repository.js'

const router = express.Router();

class OrdersRoutes {

    constructor() {
        router.get('/', this.getAll);
        router.get('/pizzerias/:idPizzeria/order/:idOrder', this.getSpecificOne);

    }

    async getAll(req, res, next) {
        try {
            let orders = await orderRepository.retrieveAll();
            res.status(200).json(orders);
        } catch (err) {
            return next(err);
        }
    }

    async getSpecificOne(req, res, next) {
        try {
            const idPizzeria = req.params.idPizzeria;
            const idOrder = req.params.idOrder;
            const retrieveOptions = {};

            if (req.query.embed && req.query.embed === 'customer') {
                retrieveOptions.customer = true;
            }

            let order = await orderRepository.retrieveByIds(idPizzeria, idOrder, retrieveOptions);

            if (order[0]) {
                order = order[0].toObject({ getters: false, virtuals: true });
                if (retrieveOptions.customer) {
                    order.customer = customerRepository.transform(order.customer);
                }
                order = orderRepository.transform(order, retrieveOptions);
                res.status(200).json(order);
            } else {
                return next(HttpError.NotFound(`La combinaison idOrder: ${idOrder} et idPizzeria ${idPizzeria}n'existe pas`));
            }

        } catch (err) {
            return next(err);
        }
    }


}

new OrdersRoutes();

export default router;