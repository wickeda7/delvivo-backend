module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: env("", "https://delvivo-backend-4cc08716e517.herokuapp.com"),
  app: {
    keys: env.array("APP_KEYS", [
      "gnZDUKiRP8qH+NSoFtCOmA==",
      "T4Wt36HMCPk8Ur6TzwSnpA==",
    ]),
  },
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
});
