<!-- source: ja/reference/cuetty.md @ f8502b6 -->

# Rendering from the command line (cuetty)

`cuetty` is a command that writes images from a scene file (`.qsc`) without the GUI.
It renders with [Umbreon](rendering.md), the same as the rendering window, and uses neither a window nor a GPU,
so it runs on servers without a display and on the compute nodes of a cluster.
It can also write the scene's animation as movie frames (numbered PNG files).

```sh
cuetty --input scene.qsc --render out.png --width 1920 --height 1080
```

## Getting cuetty

cuetty is distributed for Linux (x86-64) as `cuetty-<version>-linux-x64.tar.gz`.
It is not included in CueMol3 for macOS / Windows. To have a running CueMol3 write images,
use [tritium_cli](plugins/console/cli.md).
Get it from [Releases on GitHub](https://github.com/CueMol/cuemol3/releases).
Run it by path from where it was extracted. Neither root privileges nor an `LD_LIBRARY_PATH` setting is needed.

```sh
tar xf cuetty-<version>-linux-x64.tar.gz
cuetty-<version>-linux-x64/bin/cuetty --input scene.qsc --render out.png
```

The following are required.

- x86-64 Linux with glibc 2.28 or later (RHEL / Rocky / Alma 8 and 9, Ubuntu 20.04 or later, Debian 10 or later).
- A CPU that supports **x86-64-v3** (AVX2 / FMA / BMI1 and 2) (Intel Haswell / AMD Zen or later).
  On older CPUs, it exits with status 1 at startup.
- No GPU or display is needed. Denoising (OIDN) is also done on the CPU.
- Memory peaked at about 3 GB when a 1200×1200 px image was rendered with the default settings.
  It grows in proportion to the number of pixels and the supersampling factor. Use this as a guide for the memory allocation of jobs.

## Still images

Specifying the output PNG with `--render` writes the image and exits.

| Option | Default | Description |
|---|---|---|
| `--input <path>` | — | The input scene file (`.qsc`). Required with `--render` / `--movie`. |
| `-r`, `--render <path>` | — | The path of the output PNG |
| `--width <px>` / `--height <px>` | Scene setting | The width and height of the image. Overrides the size saved in the scene. |
| `--camera <name>` | `__current` | The camera used for rendering. Specify the name of a camera saved in the scene. |
| `--threads <count>` | See below | The number of threads used for rendering |
| `-h`, `--help` | — | Shows the list of options. |

The default camera `__current` is the view at the time the scene was saved, which the GUI writes when saving
(→ [Camera](camera.md#__current)).

When `--threads` is not specified, the environment variable `SLURM_CPUS_PER_TASK` (the number of CPUs assigned to a Slurm job)
and then `OMP_NUM_THREADS` are used; if neither is set, all cores of the machine are used.
On shared nodes, set one of these to match the job's allocation.

### Settings come from the scene

The rendering settings are the rendering window settings saved in the scene (→ [Saving settings](rendering.md#saving-settings)),
used as they are. The image is the same as one rendered in the rendering window of the GUI.
A scene with Umbreon (NPR) chosen as the backend is rendered with hatching; otherwise it is rendered with Umbreon.

A scene without saved settings is rendered with the defaults (Lighting set to Global Illumination, 1200×1200 px), and the
projection follows the camera. Only the image size and the camera can be changed from the command line.

## Movie frames

Specifying the output folder and name in the form `<folder>/<name>` with `--movie` writes the scene's animation
(edited in the [Animation panel](../ui/bottom-panels/animation.md)) as the numbered PNG files
`<name>_frm_0000.png`, `<name>_frm_0001.png`, ….
The file names are the same as when a movie is exported from the GUI.

```sh
mkdir -p frames
cuetty --input scene.qsc --movie frames/movie --fps 30
```

| Option | Default | Description |
|---|---|---|
| `--movie <folder>/<name>` | — | The output folder and name. **Create the folder beforehand** (cuetty does not create it). |
| `--fps <count>` | 30 | The frame rate. The number of frames is the length of the animation × the frame rate + 1. |
| `--no-last-frame` | OFF | Does not write the last frame. Use it for looping movies whose first and last frames are the same. |
| `--frames A-B` | All | Writes only frames A to B (inclusive, 0-based). |
| `--shard I/N` | — | Splits the frames into N consecutive parts and writes the I-th part (0-based). Cannot be used together with `--frames`. |
| `--skip-existing` | OFF | Skips frames whose files already exist. Use it to resume an interrupted job. |
| `--list-frames` | — | Shows the number of frames and exits. With `--shard 0/N`, it also shows the range of each part when split into N. |

- Each frame is rendered like a still image, with the scene's rendering settings and `--width` / `--height`.
  The starting camera is the camera specified in the animation, or the `--camera` camera if none is specified (as in the GUI).
- When rendering starts from a frame in the middle, the animation is advanced without rendering the earlier frames,
  so the images are the same as when all frames are rendered in one run.
- A frame is given its file name only after it has been written, so any existing frame file is always a complete image.
  `--skip-existing` never leaves partially written files behind. Frames already in the folder are not deleted.

cuetty writes only the frames. To combine them into a movie, use ffmpeg or a similar tool.
The settings equivalent to exporting MP4 (H.264) at the standard quality in the GUI are as follows (match `-r` and `fps=` to `--fps`).

```sh
ffmpeg -r 30 -i frames/movie_frm_%04d.png -an -crf 23 -c:v libx264 -f mp4 \
    -vf "fps=30,format=yuv420p" -y movie.mp4
```

### Distributed rendering on a PC cluster

The frames can be split into several jobs and rendered in parallel on separate nodes.
Here is an example with a Slurm array job.

```sh
#!/bin/bash
#SBATCH --array=0-3
#SBATCH --cpus-per-task=16
CUETTY=$HOME/cuetty-<version>-linux-x64/bin/cuetty
$CUETTY --input scene.qsc --movie frames/movie --fps 30 \
    --shard $SLURM_ARRAY_TASK_ID/$SLURM_ARRAY_TASK_COUNT
```

- **Create the output folder before submitting** (`mkdir -p frames; sbatch movie.sh`).
  On NFS, a folder created on one node may not be visible from another node right away,
  so cuetty does not create folders.
- Number the array from 0 without gaps (`--array=0-3`). With `--array=1-4`, the parts become 1/4 to 4/4,
  and part 0 is missing.
- Each job renders with the number of CPUs assigned to it (`SLURM_CPUS_PER_TASK`).
- Resubmitting a job that stopped partway with `--skip-existing` renders only the missing frames.

## Bringing the scene data

Unless a scene file was saved with its data embedded, it loads molecules and other data from the original files.
When rendering on another machine, do one of the following.

- Save the scene with its data embedded (→ [Saving the scene](save-scene.md)).
- Copy the files the scene refers to so that they are visible at the same paths. Relative paths are resolved from the folder containing the `.qsc`.

MD trajectories always remain separate files, even in a scene saved with embedded data.
Copy them keeping their position relative to the `.qsc`.

**A scene whose data cannot be fully loaded** (a referenced file is missing, embedded data is corrupted or incomplete, etc.)
is not rendered with parts missing; cuetty exits with an error.

## Exit status

| Status | Meaning |
|---|---|
| 0 | The output was written. |
| 1 | The scene could not be fully loaded, the specified camera does not exist, the arguments are invalid, the image could not be written, or the CPU is too old. |

The reason for a failure is written to the log, so scripts can branch on the status alone.

```sh
if ! cuetty --input scene.qsc --render out.png --width 1200 --height 900; then
    echo "render failed" >&2
    exit 1
fi
```

!!! warning "Text such as atom labels is not rendered"
    Labels such as atom names and measured distances do not appear in the image (this is not an error; everything except the labels is rendered).
    If a figure with labels is needed, use the rendering window.

## Rendering from Python

The `cuemol` Python module can also render through the same path (Umbreon).
It uses the rendering settings saved in the scene, and produces the same image as cuetty.

```sh
python -m cuemol.umbreon_render scene.qsc out.png -W 1920 -H 1080
```

`-c` specifies a camera saved in the scene. If omitted, `__current` is used.
`-W` / `-H` override the saved size.

## See also

- [Rendering](rendering.md) — Umbreon settings and saving settings
- [Rendering window](../ui/rendering-window.md) — exporting images and movies in the GUI
- [Animation](animation/index.md) — how to create animations for movies
- [Saving the scene](save-scene.md) — embedding data

---

*Verified against: CueMol3 3.0.6.577*
