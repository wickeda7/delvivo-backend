"use strict";
//controller
module.exports = {
  async cloverGetAuth(ctx, next) {
    //console.log("ctx", ctx);
    try {
      const data = await strapi
        .service("api::clover.clover")
        .cloverGetAuth(ctx);
      ctx.body = data;
      // ctx.send(
      //   {
      //     message: "The content was created!",
      //   },
      //   201
      // );
    } catch (err) {
      ctx.badRequest("Post report controller error", { moreDetails: err });
    }
  },
};
