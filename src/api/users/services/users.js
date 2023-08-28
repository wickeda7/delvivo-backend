"use strict";
const { register, login, getUser } = require("../utils");
/**
 * users service
 */

module.exports = () => ({
  getUser: async (ctx) => {
    try {
      const result = await getUser(ctx);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    } catch (error) {
      // throw new Error(error.message);
      return { error: error.message };
    }
  },
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
