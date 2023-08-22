"use strict";

/**
 * A set of functions called "actions" for `users`
 */

module.exports = {
  // exampleAction: async (ctx, next) => {
  //   try {
  //     ctx.body = 'ok';
  //   } catch (err) {
  //     ctx.body = err;
  //   }
  // },
  async cloverRegister(ctx, next) {
    try {
      const data = await strapi.service("api::users.users").cloverRegister(ctx);
      ctx.send(
        {
          data,
        },
        200
      );
    } catch (err) {
      ctx.badRequest("Post report controller error", { moreDetails: err });
    }
  },
};
