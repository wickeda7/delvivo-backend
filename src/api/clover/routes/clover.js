"use strict";
module.exports = {
  routes: [
    // {
    //   // Path defined with an URL parameter
    //   method: "POST",
    //   path: "/clover/:id/review",
    //   handler: "restaurant.review",
    // },
    {
      // Path defined with a regular expression
      method: "POST",
      path: "/clover", // Only match when the URL parameter is composed of lowercase letters
      handler: "clover.cloverGetAuth",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
