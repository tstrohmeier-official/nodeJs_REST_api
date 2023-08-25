import express from 'express';
import paginate from 'express-paginate';
import HttpError from 'http-errors';
import customersRepository from '../repositories/customers-repository.js'
import customerValidator from '../validators/customer_validator.js';
import validator from '../middlewares/validator.js';

const router = express.Router();

class CustomersRoutes {

    constructor() {
        router.get('/', paginate.middleware(20, 40), this.getAll);
        router.post('/', customerValidator.complete(), validator, this.post);
        router.put('/:idCustomer', customerValidator.complete(), validator, this.put);
    }
    //C2 Samuel Gascon
    async put(req, res, next) {
        try {
            const newCustomer = req.body;

            let customer = await customersRepository.update(req.params.idCustomer, newCustomer);

            if (!customer) {
                return next(HttpError.NotFound(`Le customer avec l'identifiant ${req.params.idCustomer} n'existe pas`));
            }
            customer = customer.toObject({ getters: false, virtual: false });
            customer = customersRepository.transform(customer);
            if (req.query._body === 'false') {
                return res.status(204).end();
            }

            res.status(200).json(customer);
        } catch (err) {
            return next(err)
        }
    }
    //C3 Samuel Gascon
    async getAll(req, res, next) {
        try {
            const retrieveOptions = {
                limit: req.query.limit,
                skip: req.skip
            }
            let filter = {}
            if (req.query.planet) {
                filter.planet = req.query.planet;
            }

            let [customers, itemCount] = await customersRepository.retieve(filter, retrieveOptions);
            if (!customers[0]) {
                return next(HttpError.NotFound('Aucun customers'));
            }
            customers = customers.map(c => {
                c = c.toObject({ getters: false, virtuals: false });
                c = customersRepository.transform(c);
                return c;
            });
            const pageCount = Math.ceil(itemCount / req.query.limit);
            const hasNextPageFunction = paginate.hasNextPages(req);
            const hasNextPage = hasNextPageFunction(pageCount);

            const pagesLinksFunction = paginate.getArrayPages(req);
            const links = pagesLinksFunction(3, pageCount, req.query.page);
            const payload = {
                _metadata: {
                    hasNextPage: hasNextPageFunction(pageCount),
                    page: req.query.page,
                    limit: req.query.limit,
                    skip: req.skip,
                    totalPages: pageCount,
                    totalDocuments: itemCount
                },
                _links: {
                    prev: `${process.env.BASE_URL}${links[0].url}`,
                    self: `${process.env.BASE_URL}${links[1].url}`,
                    next: `${process.env.BASE_URL}${links[2].url}`
                },
                data: customers
            }

            // Cas pour la premiere page
            if (req.query.page === 1) {
                delete payload._links.prev;
                payload._links.self = links[0].url;
                payload._links.next = links[1].url;
            }

            // Cas pour la derniere page
            if (!hasNextPage) {
                payload._links.self = links[2].url;
                delete payload._links.next;
                payload._links.prev = links[1].url;
            }





            return res.status(200).json(payload);

        } catch (err) {
            return next(err);
        }
    }

    // C1 - Tom Strohmeier
    async post(req, res, next) {
        const newCustomer = req.body;

        if (Object.keys(newCustomer).length === 0) {
            return next(HttpError.BadRequest('Un client ne peut pas contenir aucune informations'));
        }

        let returnContent = true;
        if (req.query._body && req.query._body === 'false') {
            returnContent = false;
        }

        try {
            let customerAdded = await customersRepository.create(newCustomer);
            customerAdded = customerAdded.toObject({ getters: false, virtuals: false });
            customerAdded = customersRepository.transform(customerAdded);

            res.append('location', `${customerAdded.href}`);

            if (returnContent === false) {
                res.status(204).end();
            } else {
                res.status(201).json(customerAdded);
            }
        } catch (err) {
            return next(err);
        }
    }
}

new CustomersRoutes();

export default router;