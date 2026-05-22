import AutoLoad from "@fastify/autoload";
import { FastifyInstance } from "fastify";
import * as path from "path";

/* eslint-disable-next-line */
export interface AppOptions {}

export async function app(fastify: FastifyInstance, opts: AppOptions) {
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: { ...opts },
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: { ...opts },
  });
}

export async function appV1(fastify: FastifyInstance, opts: AppOptions) {
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes/v1"),
    options: { ...opts },
    prefix: "/api/v1",
  });
}
