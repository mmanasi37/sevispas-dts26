# Stage 1: Build Setup
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Stage 2: Install and Build
FROM base AS build
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
COPY pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Stage 3: Production
FROM base AS prod
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
COPY --from=build /app/dist ./dist
CMD [ "node", "dist/index.js" ]
