module.exports = {
  routes: [
    {
      method: "GET",
      path: "/products/categories/:merchantId",
      handler: "product.getCategories",
    },
    //   {
    //     method: "GET",
    //     path: "/orders/storeorders", //getStoreOrders
    //     handler: "order.storeOrders",
    //   },
  ],
};
