module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: env("", "http://localhost:1337"),
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
