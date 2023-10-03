module.exports = {
  async afterUpdate(event, options) {
    const {
      result: { id, orderId, paths },
      params,
    } = event;
    // @ts-ignore
    strapi.ioServer.emit("updatePaths", { paths, orderId, id });
  },
};
