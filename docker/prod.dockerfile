# Arguments 
ARG NODE_VERSION=20.9.0
ARG NESTJS_CLI_VERSION=11.0.2

# ---- Build ---
FROM docker-usbscan-dev AS builder

USER node
WORKDIR /home/node
COPY --chown=node ./workspace/package*.json ./
RUN npm install

COPY --chown=node ./workspace .
RUN npm run build

# Remove setuid and setgid from files
RUN find / -perm /6000 -type f -exec chmod a-s {} \; || true

# ---- Release ----
FROM node:${NODE_VERSION}-alpine AS release
ARG NODE_VERSION

LABEL node_version="$NODE_VERSION"

# Install required packages
#RUN apk add --update --no-cache openssh sshpass

# Remove setuid and setgid from files
#RUN find / -perm /6000 -type f -exec chmod a-s {} \; || true

USER node
WORKDIR /home/node

# Install production only modules
COPY --chown=node ./workspace/package*.json ./
RUN npm ci --only=production

# Copy built files from builder
COPY --chown=node --from=builder /home/node/dist ./dist

# Copy DB pem file
#COPY --chown=node  ./workspace/global-bundle.pem ./

# Create shared folders
RUN mkdir -p /home/node/logs

# TODO: port shall be defined in the env file
#CMD npm run start:prod
CMD ["node", "dist/main.js"]
