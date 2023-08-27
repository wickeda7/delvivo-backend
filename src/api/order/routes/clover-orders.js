// ./src/api/order/routes/confirm-order.js

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/orders/cloverorders/:from/:to/:merchant_id",
      handler: "order.cloverOrders",
    },
    {
      method: "POST",
      path: "/orders",
      handler: "order.postOrders",
    },
  ],
};
