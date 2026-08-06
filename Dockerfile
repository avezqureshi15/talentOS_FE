FROM node:22-alpine AS builder

ARG VITE_BE_API_BASE_URL
ARG VITE_API_BASE_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_APP_URL
ARG VITE_APP_ENV
ARG VITE_SLOT_DURATION_MINUTES
ARG VITE_AI_SCAN_ANIMATION

ENV VITE_BE_API_BASE_URL=$VITE_BE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_APP_URL=$VITE_APP_URL
ENV VITE_APP_ENV=$VITE_APP_ENV
ENV VITE_SLOT_DURATION_MINUTES=$VITE_SLOT_DURATION_MINUTES
ENV VITE_AI_SCAN_ANIMATION=$VITE_AI_SCAN_ANIMATION

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginx:alpine

RUN rm -f /etc/nginx/conf.d/*

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
