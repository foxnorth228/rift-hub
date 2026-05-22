import dotenv from "dotenv";

dotenv.config({
  path: "apps/profile-service/.env",
});

import { appConfig, createLogger } from "@org/shared";
import Fastify from "fastify";

import { app, appV1 } from "./app/apps";

const server = Fastify({
  loggerInstance: createLogger({
    level: appConfig.LOG_LEVEL,
    pretty: appConfig.NODE_ENV === "development",
  }),
});

server.register(app);
server.register(appV1);

server.listen({ port: appConfig.PORT, host: appConfig.HOST }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  } else {
    console.log(`[ ready ] http://${appConfig.HOST}:${appConfig.PORT}`);
  }
});
