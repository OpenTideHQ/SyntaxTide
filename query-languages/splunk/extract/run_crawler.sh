#!/bin/bash
# Quick start script for Splunk documentation crawler
# Handles proxy configuration automatically

# Corporate proxy configuration
HTTP_PROXY="http://bessoam:D321vr4n@proxy-t2-bx.welcome.ec.europa.eu:8012/"
HTTPS_PROXY="http://bessoam:D321vr4n@proxy-t2-bx.welcome.ec.europa.eu:8012/"

echo "==================================="
echo "Splunk Documentation Crawler"
echo "==================================="
echo ""
echo "Step 1: Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "Step 2: Running crawler with proxy..."
echo "HTTP Proxy:  $HTTP_PROXY"
echo "HTTPS Proxy: $HTTPS_PROXY"
echo ""

python crawler.py \
  --http-proxy "$HTTP_PROXY" \
  --https-proxy "$HTTPS_PROXY"

echo ""
echo "==================================="
echo "✅ Crawler complete!"
echo "Check ../documentation/ for output"
echo "==================================="
