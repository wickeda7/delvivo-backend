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
    {
      method: "GET",
      path: "/merchants/:id",
      handler: "merchant.getMerchant",
    },
    {
      method: "PUT",
      path: "/merchants/:id",
      handler: "merchant.updateMerchant",
    },
  ],
};
