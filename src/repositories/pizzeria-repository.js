
import Pizzeria from "../models/pizzeria-model.js";
import ordersRepository from "./orders-repository.js";
class PizzeriaRepository {

    retrieveOne(idPizzeria, retrieveOptions = {}) {

        const retrieveQuery = Pizzeria.findOne({ _id: idPizzeria});

        if (retrieveOptions.embed === 'orders') {
            retrieveQuery.populate('orders');
        }

        return retrieveQuery;
    }

    retrieveAll(retrieveOptions, filter) {
        const retrieveQuery = Pizzeria.find(filter)
            .sort({ 'chef.name': 1 })
            .limit(retrieveOptions.limit)
            .skip(retrieveOptions.skip);
        return Promise.all([retrieveQuery, Pizzeria.countDocuments(filter)]);
    }

    //Add the href and lightspeed, delete _id
    transform(pizzeria) {
        pizzeria.href = `${process.env.BASE_URL}/pizzerias/${pizzeria._id}`;
        pizzeria.lightSpeed = `[${pizzeria.planet}]@(${pizzeria.coord.lat};${pizzeria.coord.lon})`;

        if (pizzeria.orders) 
        {
            pizzeria.orders = pizzeria.orders.map(o => {
               
                o = ordersRepository.transform(o,{});
                return o;
            });
        }

        delete pizzeria._id;
        return pizzeria;
    }

}

export default new PizzeriaRepository();