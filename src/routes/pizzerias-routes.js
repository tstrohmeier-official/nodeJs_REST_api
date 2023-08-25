import express from 'express';
import paginate from 'express-paginate';
import HttpError from 'http-errors';
import pizzeriaRepository from '../repositories/pizzeria-repository.js';

const router = express.Router();

class PizzeriasRoutes {

    constructor() {
        router.get('/', paginate.middleware(25, 50), this.getAll);
        router.get('/:idPizzeria', this.getOne);
    }

    //P1 - Tom Strohmeier
    async getAll(req, res, next) {
        try {
            const retrieveOptions = {
                limit: req.query.limit,
                skip: req.skip
            }

            let filter = {};
            if (req.query.speciality) {
                filter = { 'chef.speciality': req.query.speciality };
            }

            let [pizzerias, itemCount] = await pizzeriaRepository.retrieveAll(retrieveOptions, filter);
            const pageCount = Math.ceil(itemCount / req.query.limit);
            const hasNextPageFunction = paginate.hasNextPages(req);
            const hasNextPage = hasNextPageFunction(pageCount);
            const pagesLinksFunction = paginate.getArrayPages(req);

            const links = pagesLinksFunction(3, pageCount, req.query.page);

            pizzerias = pizzerias.map(p => {
                p = p.toObject({ getters: false, virtuals: false });
                p = pizzeriaRepository.transform(p);
                return p;
            });

            let payload = {
                _metadata: {
                    hasNextPage: hasNextPageFunction(pageCount),
                    page: req.query.page,
                    limit: req.query.limit,
                    skip: req.skip,
                    totalPages: pageCount,
                    totalDocuments: itemCount
                },
                _links: {},
                data: pizzerias
            }

            if (pageCount === 1) {
                payload._links = {
                    prev: {},
                    self: `${process.env.BASE_URL}${links[0].url}`,
                    next: {}
                }
            } else if (pageCount === 2) {
                payload._links = {
                    prev: `${process.env.BASE_URL}${links[0].url}`,
                    self: `${process.env.BASE_URL}${links[1].url}`,
                    next: {}
                }
            } else {
                payload._links = {
                    prev: `${process.env.BASE_URL}${links[0].url}`,
                    self: `${process.env.BASE_URL}${links[1].url}`,
                    next: `${process.env.BASE_URL}${links[2].url}`
                }
            }

            // Cas pour la premiere page
            if (req.query.page === 1 && pageCount !== 1) {
                delete payload._links.prev;
                payload._links.self = links[0].url;
                payload._links.next = links[1].url;
            }

            // Cas pour la derniere page
            if (!hasNextPage && pageCount !== 1) {
                payload._links.self = links[2].url;
                delete payload._links.next;
                payload._links.prev = links[1].url;
            }

            // Cas pour une seule page
            if (pageCount === 1) {
                delete payload._links.prev
                delete payload._links.next
            }

            res.status(200).json(payload);
        } catch (err) {
            return next(err);
        }
    }
    //P2 Samuel Gascon 
    async getOne(req, res, next) {
        try {
            const retrieveOptions = {};

            if (req.query.embed === 'orders') {
                retrieveOptions.embed = 'orders';
            }

            let pizzeria = await pizzeriaRepository.retrieveOne(req.params.idPizzeria, retrieveOptions);

            if (!pizzeria) {
                return next(HttpError.NotFound(`La pizzeria avec l'id ${req.params.idPizzeria} n'existe pas!`));
            }

            pizzeria = pizzeria.toObject({ getters: false, virtuals: true });
            pizzeria = pizzeriaRepository.transform(pizzeria);
            res.status(200).json(pizzeria);


        } catch (err) {
            return next(err);
        }
    }

}
new PizzeriasRoutes();
export default router;