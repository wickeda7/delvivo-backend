"use strict";
const { register, login } = require("../utils");
/**
 * users service
 */

module.exports = () => ({
  cloverRegister: async (ctx) => {
    try {
      const result = await register(ctx);
      return result;
    } catch (error) {
      throw error.message;
    }
  },
  cloverLogin: async (ctx) => {
    try {
      const result = await login(ctx);
      return result;
    } catch (error) {
      throw error.message;
      // console.log("error", error.message);
      // const { response } = error;
      // const { request, ...errorObject } = response; // take everything but 'request'
      // return errorObject.data;
    }
  },
});
