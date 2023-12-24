const { Expo } = require("expo-server-sdk");

const expo = new Expo();
const pushNotification = async ([pushTokens], data) => {
  let messages = [];
  for (let pushToken of pushTokens) {
    console.log("pushToken", pushToken);
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      throw new Error(`Push token ${pushToken} is not a valid Expo push token`);
    }

    const { departureTime, order_content } = data;
    const daten = new Date(departureTime);
    const time = daten.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const order =
      typeof order_content === "object"
        ? order_content
        : JSON.parse(order_content);
    const {
      createdOrders: {
        orderType: { systemOrderTypeId },
      },
    } = order;
    const isPickup = systemOrderTypeId === "PICK-UP-TYPE";
    const body = isPickup
      ? `Your order is ready for pickup at ${time}`
      : `Your order is on the way and will arrive at ${time}`;

    // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
    messages.push({
      to: pushToken,
      sound: "default",
      body: body,
    });
  }
  // The Expo push notification service accepts batches of notifications so
  // that you don't need to send 1000 requests to send 1000 notifications. We
  // recommend you batch your notifications to reduce the number of requests
  // and to compress them (notifications with similar content will get
  // compressed).
  //@ts-ignore
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];

  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      tickets.push(...ticketChunk);
      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
    } catch (error) {
      console.error(error);
    }
  }
};
module.exports = { pushNotification };
