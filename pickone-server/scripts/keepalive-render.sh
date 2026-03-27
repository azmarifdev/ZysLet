#!/usr/bin/env bash
set -euo pipefail
curl -fsS --retry 2 --max-time 20 "https://server.zyslet.com/health" >/dev/null
