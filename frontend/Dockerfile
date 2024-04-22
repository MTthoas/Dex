FROM node:16-alpine as build

RUN apk add --no-cache python3 make g++ git bash rust cargo

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build

FROM nginx:stable-alpine as serve
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
