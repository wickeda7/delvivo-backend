module.exports = {
  async afterUpdate(event, options) {
    const {
      result: { id, orderId, paths },
      params,
    } = event;
    const socketId = await strapi.plugins["rest-cache"].services.cacheStore.get(
      orderId
    );
    console.log("afterUpdate", socketId, orderId, id);
    if (socketId) {
      // @ts-ignore
      strapi.ioServer.to(socketId).emit("updatePaths", { paths, orderId, id });
    }
  },
};
