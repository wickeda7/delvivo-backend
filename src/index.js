"use strict";

require("dotenv").config();
const HOST_URL = process.env.HOST_URL;
module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    //strapi.server.httpServer is the new update for Strapi V4
    // @ts-ignore
    process.nextTick(() => {
      console.log("strapi.server.httpServer", HOST_URL);
      // @ts-ignore

      strapi.ioServer = require("socket.io")(strapi.server.httpServer, {
        cors: {
          // cors setup
          // "Allow-Origin": HOST_URL,
          origin: [HOST_URL, "http://localhost:3000"],
          methods: ["GET", "POST"],
          allowedHeaders: ["my-custom-header"],
          credentials: true,
        },
      });
      //strapi.services.ioServer = ioServer; // register socket io inside strapi main object to use it globally anywhere
    });
  },
};
