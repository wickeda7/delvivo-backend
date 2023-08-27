"use strict";

/**
 * order router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::order.order");
//https://strapi.io/blog/strapi-internals-customizing-the-backend-part-1-models-controllers-and-routes
//https://forum.strapi.io/t/how-to-add-custom-routes-to-core-routes-in-strapi-4/14070/7
