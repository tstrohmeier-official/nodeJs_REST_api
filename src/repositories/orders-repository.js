
import orderModel from "../models/order-model.js";

class OrdersRepository {

  retrieveAll() {
    return orderModel.find();
  }

  retrieveByIds(idPizzeria, idOrder, retrieveOptions) {
    const retrieveOrder = orderModel.find({ pizzeria: idPizzeria, _id: idOrder });

    if (retrieveOptions.customer) {
      retrieveOrder.populate('customer');
    }

    return retrieveOrder;
  }

  transform(order, retrieveOptions) {
    const taxes = 0.0087;
    order.href = `${process.env.BASE_URL}/orders/${order._id}`;

    if (!retrieveOptions.customer) {
      order.customer = { href: `${process.env.BASE_URL}/customers/${order.customer}` };
    } else {
      delete order.customer.id;
    }

    order.pizzeria = { href: `${process.env.BASE_URL}/pizzerias/${order.pizzeria}` };
    let sousTotal = 0;

    order.pizzas.forEach(p => {
      sousTotal += p.price;
      delete p.topping;
      delete p._id;
      delete p.id;
    });

    let totalTaxes = (sousTotal * taxes);
    let sommeTotal = (sousTotal + totalTaxes);
    order.subTotal = sousTotal;
    order.taxeRates = taxes;
    order.taxes = parseFloat(totalTaxes.toFixed(3));
    order.total = parseFloat(sommeTotal.toFixed(3));

    delete order._id;
    delete order.id;
    return order;
  }

}

export default new OrdersRepository();