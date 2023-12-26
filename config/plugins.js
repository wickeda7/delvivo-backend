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
  email: {
    config: {
      provider: "sendgrid", // For community providers pass the full package name (e.g. provider: 'strapi-provider-email-mandrill')
      providerOptions: {
        apiKey: env("SENDGRID_API_KEY"),
      },
      settings: {
        defaultFrom: "info@getdelvivo.com",
        defaultReplyTo: "info@getdelvivo.com",
        testAddress: "wickedgs400@yahoo.com",
      },
    },
  },

  upload: {
    config: {
      provider: "aws-s3",
      providerOptions: {
        s3Options: {
          credentials: {
            accessKeyId: env("AWS_ACCESS_KEY_ID"),
            secretAccessKey: env("AWS_ACCESS_SECRET"),
          },

          region: env("AWS_REGION"),
          params: {
            ACL: env("AWS_ACL", "public-read"),
            signedUrlExpires: env("AWS_SIGNED_URL_EXPIRES", 15 * 60),
            Bucket: env("AWS_BUCKET"),
          },
        },
      },
    },
  },

  // upload: {
  //   config: {
  //     provider: "aws-s3",
  //     providerOptions: {
  //       accessKeyId: env("AWS_ACCESS_KEY_ID"),
  //       secretAccessKey: env("AWS_ACCESS_SECRET"),
  //       region: env("AWS_REGION"),
  //       params: {
  //         ACL: env("AWS_ACL", "public-read"),
  //         signedUrlExpires: env("AWS_SIGNED_URL_EXPIRES", 15 * 60),
  //         Bucket: env("AWS_BUCKET"),
  //       },
  //     },
  //     actionOptions: {
  //       upload: {},
  //       uploadStream: {},
  //       delete: {},
  //     },
  //   },
  // },
  // upload: {
  //   config: {
  //     providerOptions: {
  //       localServer: {
  //         maxage: 300000,
  //       },
  //     },
  //   },
  // },
  // upload: {
  //   config: {
  //     provider: "aws-s3",
  //     providerOptions: {
  //       accessKeyId: env("AWS_ACCESS_KEY_ID"),
  //       secretAccessKey: env("AWS_ACCESS_SECRET"),
  //       region: env("AWS_REGION"),
  //       params: {
  //         Bucket: env("AWS_BUCKET_NAME"),
  //       },
  //     },
  //     // These parameters could solve issues with ACL public-read access — see [this issue](https://github.com/strapi/strapi/issues/5868) for details
  //     actionOptions: {
  //       upload: {
  //         ACL: null,
  //       },
  //       uploadStream: {
  //         ACL: null,
  //       },
  //     },
  //   },
  // },
  // ...
});
