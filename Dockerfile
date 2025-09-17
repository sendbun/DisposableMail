# Step 1: Use the official Node.js image as the base image
FROM node:22-alpine AS build

# Step 2: Install OpenSSL and other required dependencies
RUN apk add --no-cache openssl

# Step 3: Install pnpm globally
RUN npm install -g pnpm@latest

# Step 4: Set the working directory in the container
WORKDIR /app

# Step 5: Copy package.json and pnpm-lock.yaml to avoid reinstalling dependencies on every build
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Step 6: Copy the Next.js app code to the container
COPY . .

# Step 7: Build the Next.js app
RUN pnpm run build

# Step 8: Create a new stage for the final image
FROM node:22-alpine AS production

# Step 9: Install OpenSSL
RUN apk add --no-cache openssl

# Step 10: Install pnpm globally in production stage
RUN npm install -g pnpm@latest

# Step 11: Set the working directory for the production container
WORKDIR /app

# Step 12: Copy only the necessary files from the build stage
COPY --from=build /app /app

# Step 13: Install only production dependencies using pnpm
RUN pnpm install --prod

# Step 14: Expose the port your app will run on
EXPOSE 3000

# Step 15: Start the Next.js application
CMD ["pnpm", "start"]