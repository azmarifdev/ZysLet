FROM node:22.0-alpine 

WORKDIR /src

# Build arguments for Next.js environment variables
ARG NEXT_PUBLIC_BASE_URL=https://server.zyslet.com

# Set environment variables for build
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

COPY package*.json ./
COPY . .

RUN npm install

# Build the app with standalone output
RUN npm run build

# App listens on port 3000
EXPOSE 3000

# Use the standalone server as recommended by Next.js
CMD ["npm", "start"]
