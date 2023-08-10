'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('clover')
      .service('myService')
      .getWelcomeMessage();
  },
});
