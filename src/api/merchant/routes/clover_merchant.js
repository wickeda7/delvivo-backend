module.exports = {
  routes: [
    //   {
    //     method: "GET",
    //     path: "/orders/cloverorders/:from/:to/:merchantId/:accesToken",
    //     handler: "order.cloverOrders",
    //   },
    //   {
    //     method: "GET",
    //     path: "/orders/storeorders", //getStoreOrders
    //     handler: "order.storeOrders",
    //   },
    //   {
    //     method: "POST",
    //     path: "/orders",
    //     handler: "order.postOrders",
    //   },
    {
      method: "PUT",
      path: "/merchants/:id",
      handler: "merchant.updateMerchant",
    },
  ],
};