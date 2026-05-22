import {
  createProfileSchema,
  Profile,
  profileParamsSchema,
  profileResponseSchema,
} from "@org/contracts";
import { hashPassword } from "@org/shared";
import { FastifyInstance } from "fastify";
import z from "zod";

const profiles = new Map<string, Profile>();

export default async function (fastify: FastifyInstance) {
  fastify.get(
    "/profile/:id",
    {
      schema: {
        tags: ["Profile"],
        summary: "Get user profile",
        description: "Retrieve the profile information for the authenticated user",
        params: z.toJSONSchema(profileParamsSchema),
        response: {
          200: z.toJSONSchema(profileResponseSchema),
        },
      },
    },
    async (req, reply) => {
      const { id } = req.params as { id: string };

      const profile = profiles.get(id);

      if (!profile) {
        return reply.code(404).send({ message: "Profile not found" });
      }

      return profile;
    },
  );

  fastify.post(
    "/create-profile",
    {
      schema: {
        tags: ["Profile"],
        summary: "Create profile",
        body: z.toJSONSchema(createProfileSchema),
        response: {
          200: z.toJSONSchema(profileResponseSchema),
        },
      },
    },
    async (req, reply) => {
      const parseResult = createProfileSchema.safeParse(req.body);

      if (!parseResult.success) {
        return reply.code(400).send({
          message: "Invalid request body",
          errors: z.treeifyError(parseResult.error),
        });
      }

      const id = crypto.randomUUID();
      const now = new Date().toISOString();

      const profile: Profile = {
        id,
        email: parseResult.data.email,
        passwordHash: hashPassword(parseResult.data.password),
        createdAt: now,
        updatedAt: now,
      };

      profiles.set(id, profile);

      return profile;
    },
  );
}
