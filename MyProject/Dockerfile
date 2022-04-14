# base image
FROM alpine
RUN apk add --update nodejs npm

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
CMD ["npm", "run", "server"]