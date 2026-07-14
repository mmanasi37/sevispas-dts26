import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import dotenv from "dotenv";
import { z } from "zod";

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// config({ path: path.resolve(__dirname, '../.env') });

type Environment = "development" | "test" | "staging" | "production";

const dotEnvDefault = ".env";
const dotEnvTest = ".env.test";
const dotEnvDevelopment = ".env.development";
const dotEnvProduction = ".env.production";
const dotEnvStaging = ".env.staging";

// Load environment variables from .env file
// and get the environment specified
const environment = getEnvironment();

// then load the name of the specific environment file
const envFile = getEnvFile(environment!);

// and the last, re-configure dotenv with environment we send
const envVar = dotenv.config({
    path: path.resolve(process.cwd(), envFile),
});

// dotenv.config();

// Define the environment schema using Zod
const envSchema = z.object({
    PORT: z
        .string()
        .refine((port) => {
            const portNum = parseInt(port, 10);
            return portNum > 0 && portNum < 65536;
        }, "PORT must be a valid port number between 1 and 65535")
        .transform((val) => Number(val))
        .default(3000),
    HOST: z.string(),
    DEBUG: z.string().optional(),
    APP_ENV: z
        .enum(["development", "production", "staging", "test"])
        .default("development"),
    NODE_ENV: z
        .enum(["development", "production", "staging", "test"])
        .default("development"),
    // JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),

    JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),

    OIDC4VP_SERVER_URL: z.string(),
    OIDC4VP_CLIENT_ID: z.string(),
    OIDC4VP_CLIENT_SECRET: z.string(),
    OIDC4VP_CALLBACK_URL: z.string(),

    SESSION_SECRET: z.string(),

    ALLOWED_ORIGINS: z.string(),
    ALLOWED_CALLBACK_URLS: z.string(),

    TURSO_DATABASE_URL: z.string(),
    TURSO_AUTH_TOKEN: z.string(),
});

// Infer the TypeScript type from the schema
export type Env = z.infer<typeof envSchema>;

// Validate and parse the environment variables
const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
    console.error(
        "❌ Invalid environment variables:",
        parseResult.error.flatten().fieldErrors,
    );
    throw new Error("Invalid environment variables");
}

// Export the validated environment variables
export const env: Env = parseResult.data;

function getEnvFile(environment: Environment): string {
    switch (environment) {
        case "development":
            return dotEnvDevelopment;
        case "test":
            return dotEnvTest;
        case "staging":
            return dotEnvStaging;
        case "production":
            return dotEnvProduction;
        default:
            return dotEnvDefault;
    }
}

function getEnvironmentVariable(variable: string): string | undefined {
    return process.env[variable];
}

function getEnvironment(): Environment | null {
    return getEnvironmentVariable("NODE_ENV") as Environment;
}

// check which environment is set up
function isDevelopment() {
    return getEnvironment() === "development";
}

function isTest() {
    return getEnvironment() === "test";
}

function isProduction() {
    return getEnvironment() === "production";
}
