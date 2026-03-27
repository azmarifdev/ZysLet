FROM node:22.0-alpine

WORKDIR /client

# Build arguments for Next.js environment variables
ARG NEXT_PUBLIC_BASE_URL=https://server.zyslet.com
ARG NEXT_PUBLIC_API_BASE_URL=https://server.zyslet.com
ARG NEXT_PUBLIC_GTM_ID
ARG NEXT_PUBLIC_META_PIXEL_ID

# Set environment variables for build
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_GTM_ID=$NEXT_PUBLIC_GTM_ID
ENV NEXT_PUBLIC_META_PIXEL_ID=$NEXT_PUBLIC_META_PIXEL_ID

COPY package*.json ./
COPY . .

RUN npm install

# Build the app with standalone output
RUN npm run build

EXPOSE 4000

# Use the standalone server as recommended by Next.js
CMD ["npm", "start"]
