# Use official Node image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Build app
RUN npm run build

# Start app
CMD ["npm", "start"]
