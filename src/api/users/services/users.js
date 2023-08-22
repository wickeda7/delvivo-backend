"use strict";
const { register } = require("../utils");
/**
 * users service
 */

module.exports = () => ({
  cloverRegister: async (ctx) => {
    try {
      const result = await register(ctx);
      return result;
    } catch (error) {
      const { response } = error;
      const { request, ...errorObject } = response; // take everything but 'request'
      console.log(errorObject.data);
      return errorObject.data;
    }
  },
});
