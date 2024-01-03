"use strict";

require("dotenv").config();
const { registerRedish } = require("./api/users/utils");
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

      strapi.ioServer.use((socket, next) => {
        const userid = socket.handshake.auth.userid;
        if (!userid) {
          return next(new Error("invalid merchantId"));
        }
        socket.userid = userid;
        next();
      });
      strapi.ioServer.on("connection", (socket) => {
        registerRedish(socket.userid, socket.id);
        console.log("socket.userid", socket.userid);
        console.log("socket.id", socket.id);
        // socket.on("updateOrder", async ({ content, to }) => {
        //   console.log("content", content);
        //   console.log("to", to);
        //   socket.to(to).emit("updateOrder", {
        //     content,
        //     from: socket.id,
        //   });
        // });
        // socket.on("subscribe", async (merchant_id) => {
        //   registerRedish(merchant_id, socket.id);

        // });

        // socket.on("disconnect", () => {
        //   console.log("socket disconnected");
        // });
      });
      //strapi.services.ioServer = strapi.ioServer; // register socket io inside strapi main object to use it globally anywhere
    });
  },
};
