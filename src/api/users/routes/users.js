module.exports = {
  routes: [
    // {
    //  method: 'GET',
    //  path: '/users',
    //  handler: 'users.exampleAction',
    //  config: {
    //    policies: [],
    //    middlewares: [],
    //  },
    // },
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
  ],
};
