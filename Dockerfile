FROM node:20-alpine

# Install bash (needed by start-dev.sh)
RUN apk add --no-cache bash dos2unix

WORKDIR /var/www/mf-user-test

# Copy package files first for better layer caching
COPY package.json package-lock.json ./
COPY apps/shell/package.json ./apps/shell/
COPY apps/users-mfe/package.json ./apps/users-mfe/
COPY apps/countries-mfe/package.json ./apps/countries-mfe/

# Install all dependencies
RUN npm install

# Copy the rest of the source
COPY . .

EXPOSE 5173 5174 5175

# Fix CRLF line endings if file was edited on Windows
RUN dos2unix start-dev.sh

CMD ["bash", "start-dev.sh"]
