FROM node:20 As base


FROM base As development
WORKDIR /app
COPY package.json ./
RUN npm install 
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start-dev"]

FROM base As production
WORKDIR /app
COPY package.json ./
RUN npm install --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]