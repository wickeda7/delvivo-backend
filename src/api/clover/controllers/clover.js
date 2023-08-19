"use strict";
//controller
module.exports = {
  async cloverGetAuth(ctx, next) {
    try {
      const data = await strapi
        .service("api::clover.clover")
        .cloverGetAuth(ctx);
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
  async cloverOrder(ctx, next) {
    //console.log("ctx", ctx);
    try {
      const data = await strapi.service("api::clover.clover").cloverOrder(ctx);
      ctx.body = data;
    } catch (err) {
      ctx.badRequest("Post report controller error", { moreDetails: err });
    }
  },
  async cloverGetMap(ctx, next) {
    try {
      const data = await strapi.service("api::clover.clover").cloverGetMap(ctx);
      ctx.body = data;
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
