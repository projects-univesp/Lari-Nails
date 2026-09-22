# Stage 1: Build
FROM cgr.dev/chainguard/node:latest AS build
WORKDIR /build

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci

COPY --chown=node:node . .

ARG VITE_API_BASE_URL=http://localhost:3000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Stage 2: Distroless Runtime
FROM gcr.io/distroless/nodejs24-debian13:latest
WORKDIR /app

COPY --from=build /build/dist ./dist
COPY --from=build /build/server.mjs ./server.mjs
COPY --from=build /build/package.json ./package.json

ENV PORT=5173
ENV NODE_ENV=production

EXPOSE 5173
CMD [ "server.mjs" ]
