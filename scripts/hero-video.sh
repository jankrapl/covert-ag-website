#!/usr/bin/env bash
# Builds the homepage hero loops in public/video.
#
# Source: fal.ai, model google/gemini-omni-flash/v1.1/image-to-video, 4k, 10 s, with
# assets/photos/home-hero.jpg as both first and last frame. The 43 MB source is not in git; on dev2 it
# is ~/coverd/video-sources/hero-bridge-gemini-4k.mp4. Prompt:
#   "Real-time footage from a camera locked on a tripod; the camera does not move, pan or zoom. A quiet
#   blue-hour evening in a Swiss old town. Very little moves: the low mist on the forested mountainside
#   drifts slowly and almost imperceptibly to the right, and the clouds above the peaks creep along at
#   the same unhurried pace. The river moves naturally across its entire width: the current flows
#   steadily from the near bank all the way to the far bank below the houses, the white water at the
#   weir beside the stone piers churns gently, and the long reflections of the lit windows and lamps
#   ripple and shimmer on the moving water under the houses. The covered wooden bridge, the clock tower
#   and the houses stay perfectly still and sharp; the clock hands do not move; no people, boats or
#   birds appear. Photorealistic, natural light, not a time-lapse."
# Rejected: Kling 4 (mist too fast, or the far water still), Veo 3.1 and Seedance 2.5 (camera moved),
# Gemini at 1080p without an end frame (camera drifted, houses changed).
#
# Steps:
# 1. Use frames 68-239 only. Around frame 65 the mist changes shape abruptly.
# 2. Loop: start one second in and crossfade the last second into it, so there is no jump.
# 3. Freeze the bridge, the town and the clock face from a single frame (cinemagraph), using
#    assets/video/hero-bridge-freeze-mask.png (white = frozen). The model lets the clock hands jump and
#    the stone texture shimmer; sky, mist and water stay live.
# 4. One keyframe for the whole clip, so still areas do not flicker at every GOP.
# Needs ffmpeg with libx264.
#
# Memory: dev2 shares 3.8 GB with live websites. On 2026-11-03 an earlier version of this script fed
# 4K stills into the filter graph as looping inputs; they queued up as raw 4K frames, the server
# swapped until it stopped responding and had to be rebooted, twice. So now:
# - every ffmpeg call runs in its own cgroup with a hard memory cap and no swap (HERO_VIDEO_MEM,
#   default 700M). If it needs more, only ffmpeg is killed, never the server.
# - the 4K source is decoded once per output into a 1080p file on disk; everything after that
#   works at output size.
# - the frozen part is a single RGBA still laid over the video (no looping image inputs).
# - decoder, filters and encoder are limited to two threads.
set -euo pipefail
cd "$(dirname "$0")/.."
src=${1:-$HOME/coverd/video-sources/hero-bridge-gemini-4k.mp4}
mask=assets/video/hero-bridge-freeze-mask.png
cap=${HERO_VIDEO_MEM:-700M}
tmp=$(mktemp -d -p /var/tmp)  # on disk: /tmp on dev2 is a RAM disk
trap 'rm -rf "$tmp"' EXIT

run() { # one capped ffmpeg call
  if command -v systemd-run >/dev/null && sudo -n true 2>/dev/null; then
    sudo -n systemd-run --scope -q --uid="$(id -u)" --gid="$(id -g)" \
      -p MemoryMax="$cap" -p MemorySwapMax=0 -p CPUQuota=200% -- nice -n 19 ffmpeg -v error -nostdin -y "$@"
  else
    nice -n 19 ffmpeg -v error -nostdin -y "$@"
  fi
}

x264=(-c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -tune film -g 300 -keyint_min 300 -sc_threshold 0
  -threads 2 -x264-params rc-lookahead=24 -movflags +faststart -an)

build() { # $1 = crop and scale chain from 4K, $2 = crf, $3 = output
  # 1. Frames 68-239 at output size, lossless, from a single decode of the 4K source.
  run -threads 2 -i "$src" -filter_threads 1 -vf "select=gte(n\,68),setpts=N/24/TB,$1:flags=lanczos" \
    -frames:v 172 -c:v ffv1 -threads 2 "$tmp/seg.mkv"
  # 2. The frozen layer: frame 92 of the source with the mask as its alpha channel.
  run -threads 2 -i "$src" -vf "select=eq(n\,92),$1:flags=lanczos" -frames:v 1 "$tmp/plate.png"
  run -i "$mask" -vf "scale=3840:2160:flags=bicubic,$1:flags=bicubic,format=gray" -frames:v 1 "$tmp/alpha.png"
  run -i "$tmp/plate.png" -i "$tmp/alpha.png" -filter_complex "[0:v][1:v]alphamerge,format=rgba" -frames:v 1 "$tmp/frozen.png"
  # 3. Loop with a one-second crossfade, lay the frozen layer over it, encode.
  run -threads 2 -i "$tmp/seg.mkv" -i "$tmp/frozen.png" -filter_threads 1 -filter_complex_threads 1 -filter_complex "\
[0:v]split=3[a][b][c];\
[a]trim=start_frame=24:end_frame=148,setpts=PTS-STARTPTS[body];\
[b]trim=start_frame=148:end_frame=172,setpts=PTS-STARTPTS[tail];\
[c]trim=start_frame=0:end_frame=24,setpts=PTS-STARTPTS[head];\
[tail][head]blend=all_expr='A*(1-(N+1)/25)+B*((N+1)/25)'[x];\
[body][x]concat=n=2:v=1:a=0[loop];\
[loop][1:v]overlay=eof_action=repeat:format=auto,format=yuv420p" -frames:v 148 "${x264[@]}" -crf "$2" "$3"
  rm -f "$tmp"/*
}

mkdir -p public/video
# Landscape screens get the full frame.
build "scale=1920:1080" 24 public/video/hero-bridge-1080.mp4
# Portrait screens get a crop around the clock tower, matching what the still shows there.
build "crop=1728:2160:1396:0,scale=1080:1350" 25 public/video/hero-bridge-portrait.mp4
ls -l public/video
