module.exports = {
  routes: [
    {
      method: "GET",
      path: "/users/:customerId/:merchantId/:accessToken",
      handler: "users.getUser",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      // Path defined with an URL parameter
      method: "POST",
      path: "/users/register", ///api/users/register
      handler: "users.cloverRegister",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      // Path defined with an URL parameter
      method: "POST",
      path: "/users/login", ///api/users/register
      handler: "users.cloverLogin",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      // Path defined with an URL parameter
      method: "PUT",
      path: "/users/:id",
      handler: "users.updateUser",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
