"use strict";
module.exports = {
  routes: [
    {
      // Path defined with an URL parameter
      method: "GET",
      path: "/clover/setup",
      handler: "clover.cloverSetup",
    },

    {
      // Path defined with an URL parameter
      method: "POST",
      path: "/clover/setup",
      handler: "clover.cloverSetup",
    },
    {
      // Path defined with an URL parameter
      method: "POST",
      path: "/clover",
      handler: "clover.cloverGetAuth",
    },

    {
      // Path defined with a regular expression
      method: "POST",
      path: "/clover/pay", // Only match when the URL parameter is composed of lowercase letters
      handler: "clover.cloverOrder",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      // Path defined with a regular expression
      method: "POST",
      path: "/clover/map", // Only match when the URL parameter is composed of lowercase letters
      handler: "clover.cloverGetMap",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
