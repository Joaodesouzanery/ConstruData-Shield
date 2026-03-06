#
# Multi-stage Dockerfile for ConstruData Shield
# Uses Chainguard Wolfi for minimal attack surface
#

# Builder stage
FROM cgr.dev/chainguard/wolfi-base:latest AS builder

RUN apk update && apk add --no-cache \
    build-base \
    git \
    curl \
    wget \
    ca-certificates \
    libpcap-dev \
    linux-headers \
    go \
    nodejs-22 \
    npm \
    python3 \
    py3-pip \
    ruby \
    ruby-dev \
    nmap \
    bash

ENV GOPATH=/go
ENV PATH=$GOPATH/bin:/usr/local/go/bin:$PATH
ENV CGO_ENABLED=1

RUN mkdir -p $GOPATH/bin

# Install security tools
RUN go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest

RUN git clone --depth 1 https://github.com/urbanadventurer/WhatWeb.git /opt/whatweb && \
    chmod +x /opt/whatweb/whatweb && \
    gem install addressable && \
    echo '#!/bin/bash' > /usr/local/bin/whatweb && \
    echo 'cd /opt/whatweb && exec ./whatweb "$@"' >> /usr/local/bin/whatweb && \
    chmod +x /usr/local/bin/whatweb

RUN pip3 install --no-cache-dir schemathesis

# Runtime stage
FROM cgr.dev/chainguard/wolfi-base:latest AS runtime

USER root
RUN apk update && apk add --no-cache \
    git \
    bash \
    curl \
    ca-certificates \
    libpcap \
    nmap \
    nodejs-22 \
    npm \
    python3 \
    ruby \
    chromium \
    nss \
    freetype \
    harfbuzz \
    libx11 \
    libxcomposite \
    libxdamage \
    libxext \
    libxfixes \
    libxrandr \
    mesa-gbm \
    fontconfig

COPY --from=builder /go/bin/subfinder /usr/local/bin/
COPY --from=builder /opt/whatweb /opt/whatweb
COPY --from=builder /usr/local/bin/whatweb /usr/local/bin/whatweb
RUN gem install addressable

COPY --from=builder /usr/lib/python3.*/site-packages /usr/lib/python3.12/site-packages
COPY --from=builder /usr/bin/schemathesis /usr/bin/

# Create non-root user
RUN addgroup -g 1001 shield && \
    adduser -u 1001 -G shield -s /bin/bash -D shield

WORKDIR /app

COPY package*.json ./
COPY mcp-server/package*.json ./mcp-server/

RUN npm ci && \
    cd mcp-server && npm ci && cd .. && \
    npm cache clean --force

COPY . .

# Build TypeScript
RUN cd mcp-server && npm run build && cd .. && npm run build

# Remove devDependencies
RUN npm prune --production && \
    cd mcp-server && npm prune --production

RUN npm install -g @anthropic-ai/claude-code

RUN mkdir -p /app/sessions /app/deliverables /app/repos /app/configs && \
    mkdir -p /tmp/.cache /tmp/.config /tmp/.npm && \
    chmod 777 /app && \
    chmod 777 /tmp/.cache && \
    chmod 777 /tmp/.config && \
    chmod 777 /tmp/.npm && \
    chown -R shield:shield /app

USER shield

ENV NODE_ENV=production
ENV PATH="/usr/local/bin:$PATH"
ENV SHIELD_DOCKER=true
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV npm_config_cache=/tmp/.npm
ENV HOME=/tmp
ENV XDG_CACHE_HOME=/tmp/.cache
ENV XDG_CONFIG_HOME=/tmp/.config

RUN git config --global user.email "shield@construdata.com" && \
    git config --global user.name "ConstruData Shield Agent" && \
    git config --global --add safe.directory '*'

ENTRYPOINT ["node", "dist/temporal/worker.js"]
