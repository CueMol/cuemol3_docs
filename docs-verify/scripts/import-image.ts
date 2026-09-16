/**
 * Converts a hand-made figure (PNG, JPEG, ...) into the WebP form the docs
 * use: downscaled to the page width and squeezed into the image budget that
 * `task check:images` enforces. Screenshots of the app itself are captured by
 * docs-verify (`task e2e:shots`); this is for figures a human makes.
 *
 * Encoder and quality ladder match helpers/docShot.ts, so hand-made and
 * generated figures look consistent.
 *
 * Usage, from the repository root:
 *   task images:import -- <input> [<output>] [--width N] [--quality N]
 *
 *   <output>  A .webp path, or a directory to put <input basename>.webp in.
 *             May be omitted when <input> is already under docs/assets/images.
 *   --width   Target width in pixels (default 1280, the page width). Use
 *             --width 0 to keep the original size, e.g. for a 2x crop of a
 *             GUI element shown at half size with a markdown width attribute.
 *   --quality Starting WebP quality (default 82). Lower steps are still tried
 *             if the result does not fit the budget.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

const REPO_ROOT = path.join(__dirname, '..', '..');
const IMAGES_DIR = path.join(REPO_ROOT, 'docs', 'assets', 'images');
const MANIFEST = path.join(__dirname, '..', 'docshot-manifest.json');
const DEFAULT_WIDTH = 1280;
const MAX_BYTES = 300 * 1024;
const QUALITIES = [82, 70, 58, 46];

interface Args {
    input: string;
    output?: string;
    width: number;
    quality: number;
}

function usage(message: string): never {
    console.error(`error: ${message}\n`);
    console.error('usage: task images:import -- <input> [<output>] [--width N] [--quality N]');
    process.exit(1);
}

function parseArgs(argv: string[]): Args {
    const positional: string[] = [];
    let width = DEFAULT_WIDTH;
    let quality = QUALITIES[0];

    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--width' || arg === '--quality') {
            const value = Number(argv[++i]);
            if (!Number.isFinite(value) || value < 0) usage(`${arg} needs a number`);
            if (arg === '--width') width = value;
            else quality = value;
        } else if (arg.startsWith('-')) {
            usage(`unknown option ${arg}`);
        } else {
            positional.push(arg);
        }
    }

    if (positional.length === 0) usage('no input file given');
    if (positional.length > 2) usage('too many paths given');
    return { input: positional[0], output: positional[1], width, quality };
}

/** Where the .webp goes: an explicit path, a directory, or next to the input. */
function resolveOutput(input: string, output: string | undefined): string {
    const webpName = `${path.basename(input, path.extname(input))}.webp`;

    if (!output) {
        const inDir = path.dirname(path.resolve(input));
        if (path.relative(IMAGES_DIR, inDir).startsWith('..')) {
            usage('an output path is required unless the input is under docs/assets/images');
        }
        return path.join(inDir, webpName);
    }

    const resolved = path.resolve(output);
    if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
        return path.join(resolved, webpName);
    }
    return resolved.endsWith('.webp') ? resolved : `${resolved}.webp`;
}

/** Warns when the target is a figure that `task e2e:shots` generates. */
function warnIfGenerated(file: string): void {
    const id = path.relative(IMAGES_DIR, file).replace(/\.webp$/, '');
    if (id.startsWith('..')) return;
    let manifest: Record<string, string>;
    try {
        manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) as Record<string, string>;
    } catch {
        return;
    }
    if (manifest[id] === undefined) return;
    console.warn(
        `warning: ${id} is captured by \`task e2e:shots\`. Replacing it makes the figure ` +
        'hand-made: later runs report SKIP and leave it alone (docs-verify/PLAYBOOK.md).',
    );
}

/** Repository-relative path when the file is in the repo, absolute otherwise. */
function display(file: string): string {
    const rel = path.relative(REPO_ROOT, path.resolve(file));
    return rel.startsWith('..') ? path.resolve(file) : rel;
}

async function main(): Promise<void> {
    const args = parseArgs(process.argv.slice(2));
    if (!fs.existsSync(args.input)) usage(`no such file: ${args.input}`);

    const output = resolveOutput(args.input, args.output);
    if (path.resolve(args.input) === output) usage('the input is already the output file');
    warnIfGenerated(output);

    const sharp = (await import('sharp')).default;
    const source = fs.readFileSync(args.input);
    const { width: srcWidth = 0, height: srcHeight = 0 } = await sharp(source).metadata();

    const ladder = QUALITIES.filter((q) => q < args.quality);
    ladder.unshift(args.quality);

    let out: Buffer | undefined;
    let used = 0;
    for (const quality of ladder) {
        let img = sharp(source);
        if (args.width > 0 && srcWidth > args.width) img = img.resize({ width: args.width });
        out = await img.webp({ quality }).toBuffer();
        used = quality;
        if (out.length <= MAX_BYTES) break;
    }
    if (!out || out.length > MAX_BYTES) {
        console.error(
            `error: ${Math.round((out?.length ?? 0) / 1024)} KB even at q=${used}, over the ` +
            `${MAX_BYTES / 1024} KB budget. Crop the figure or pass a smaller --width.`,
        );
        process.exit(1);
    }

    const existed = fs.existsSync(output);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, out);

    const { width = 0, height = 0 } = await sharp(out).metadata();
    const kb = (n: number) => `${Math.round(n / 1024)} KB`;
    console.log(
        `${existed ? 'replaced' : 'wrote'} ${display(output)} ` +
        `(${width}x${height}, ${kb(out.length)}, q=${used}; from ${srcWidth}x${srcHeight}, ${kb(source.length)})`,
    );

    const inputInDocs = !path.relative(IMAGES_DIR, path.resolve(args.input)).startsWith('..');
    if (inputInDocs) {
        console.log(`note: the source ${display(args.input)} is still in docs/; remove it once the WebP looks right.`);
    }
}

main().catch((err: unknown) => {
    console.error(err);
    process.exit(1);
});
