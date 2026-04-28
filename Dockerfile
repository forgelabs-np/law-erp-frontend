FROM node:22-alpine AS builder

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn build

FROM nginx:stable-alpine

COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]