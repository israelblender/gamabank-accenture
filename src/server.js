require("./configs/bootstrap");
const Hapi = require("@hapi/hapi");

const swagger = require("./configs/swagger");
const routes = require("./routes");
const jwtStrategy = require("./configs/jwtStrategy");

const server = async () => {
  const hapiServer = Hapi.Server({
    host: process.env.HOST || "localhost",
    port: process.env.PORT || 3000,
  });

  await hapiServer.register(require("hapi-auth-jwt2"));
  await hapiServer.register(swagger);

  await hapiServer.auth.strategy(
    jwtStrategy.authName,
    jwtStrategy.authSchema,
    jwtStrategy.authOptions
  );

  hapiServer.route(routes);

  return hapiServer;
};

process.on("unhandledRejection", (err) => {
  console.log("########### OCORREU UM ERRO ##########");
  console.log(err);
  process.exit(1);
});

module.exports = server();
