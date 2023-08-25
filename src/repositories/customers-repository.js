
import dayjs from "dayjs";
import customerModel from "../models/customer-model.js";
import objectToDotNotation from '../libs/objectToDotNotation.js';

class customersRepository {

    retieve(filter, retrieveOptions) {
        const retrieveQuery = customerModel
            .find(filter)
            .sort({ birthday: 1 })
            .limit(retrieveOptions.limit)
            .skip(retrieveOptions.skip);

        return Promise.all([retrieveQuery, customerModel.countDocuments(filter)]);
    }
    update(idCustomer, customerModif) {

        const customerToDotNotation = objectToDotNotation(customerModif);
        return customerModel.findByIdAndUpdate(idCustomer, customerToDotNotation, {new:true});

    }
    transform(customers) {
        customers.href = `${process.env.BASE_URL}/customers/${customers._id}`;
        customers.lightSpeed = `[${customers.planet}]@(${customers.coord.lat};${customers.coord.lon})`;

        customers.age = dayjs().subtract(dayjs(customers.birthday).year(), 'year').year();
        customers.phone = `[${customers.phone.substring(0, 4)}]${customers.phone.substring(4, 8)}-${customers.phone.substring(8)}`;

        delete customers._id;
        delete customers.__v;

        return customers;
    }

    create(newCustomer) {
        return customerModel.create(newCustomer);
    }
}

export default new customersRepository();