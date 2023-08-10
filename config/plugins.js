module.exports = ({ env }) => ({
  // ...
  clover: {
    enabled: true,
    resolve: "./src/plugins/clover",
    config: {
      provider: "strapi-provider-clover", // For community providers pass the full package name (e.g. provider: 'strapi-provider-upload-google-cloud-storage')
      providerOptions: {
        CLOVER_APP_ID: env("CLOVER_APP_ID"),
        CLOVER_APP_SECRET: env("CLOVER_APP_SECRET"),
        CLOVER_APP: env("CLOVER_APP"),
        // params: {
        //   ACL: env("AWS_ACL", "public-read"), // 'private' if you want to make the uploaded files private
        //   Bucket: env("AWS_BUCKET"),
        // },
      },
    },
  },
  // ...
});
