#!/usr/bin/env bash
# Builds the homepage hero loops in public/video from assets/video/hero-bridge-source.mp4.
#
# Source: fal.ai, model kling/v4/image-to-video, 1080p, 10 s, with assets/photos/home-hero.jpg as
# both start and end frame so the clip comes back to its first picture. Prompt:
#   "Static locked-off tripod shot, real-time footage, not a timelapse; the camera never moves. Blue
#   hour in a Swiss old town. The bands of low mist drift slowly but clearly from left to right along
#   the forested mountainside, thinning and reforming as they move, and the clouds in the sky above
#   the peaks glide gently in the same direction. The river flows steadily under the covered wooden
#   bridge with natural ripples, and the warm reflections of the lamps shimmer on the water. The
#   bridge, the clock tower and the houses stay perfectly still and sharp; the clock hands do not
#   move. Photorealistic, natural, calm."
# Veo 3.1 and Seedance 2.5 were tried with the same still and rejected: both moved the camera.
#
# The loop drops the first second and crossfades the last second into it, so there is no jump.
# One keyframe for the whole clip keeps the still buildings from flickering every GOP.
# Needs ffmpeg with libx264.
set -euo pipefail
cd "$(dirname "$0")/.."
src=assets/video/hero-bridge-source.mp4
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

loop="[0:v]split=3[a][b][c];\
[a]trim=start_frame=24:end_frame=217,setpts=PTS-STARTPTS[body];\
[b]trim=start_frame=217:end_frame=241,setpts=PTS-STARTPTS[tail];\
[c]trim=start_frame=0:end_frame=24,setpts=PTS-STARTPTS[head];\
[tail][head]blend=all_expr='A*(1-(N+1)/25)+B*((N+1)/25)'[x];\
[body][x]concat=n=2:v=1:a=0,format=yuv420p"
ffmpeg -v error -y -i "$src" -filter_complex "$loop" -c:v ffv1 -an "$tmp/loop.mkv"

x264=(-c:v libx264 -preset slower -profile:v high -pix_fmt yuv420p -tune film -g 300 -keyint_min 300 -sc_threshold 0 -movflags +faststart -an)
mkdir -p public/video
# Landscape screens get the full frame.
ffmpeg -v error -y -i "$tmp/loop.mkv" "${x264[@]}" -crf 24 public/video/hero-bridge-1080.mp4
# Portrait screens get a crop around the clock tower, matching what the still shows there.
ffmpeg -v error -y -i "$tmp/loop.mkv" -vf "crop=864:1080:698:0" "${x264[@]}" -crf 25 public/video/hero-bridge-portrait.mp4
ls -l public/video
