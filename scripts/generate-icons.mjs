import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const sourcePath = resolve(root, "resources/icon.png");
const buildDir = resolve(root, "build");
const icoSizes = [16, 24, 32, 48, 64, 128, 256];
// ICNS 中分别包含标准分辨率和 Retina 分辨率的 PNG 图层。
const icnsTypes = [
  ["icp4", 16],
  ["icp5", 32],
  ["icp6", 64],
  ["ic07", 128],
  ["ic08", 256],
  ["ic09", 512],
  ["ic10", 1024],
  ["ic11", 32],
  ["ic12", 64],
  ["ic13", 256],
  ["ic14", 512]
];

function createIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(icoSizes.length, 4);
  let offset = header.length + icoSizes.length * 16;
  const entries = icoSizes.map((size) => {
    const png = images.get(size);
    const entry = Buffer.alloc(16);
    // ICO 用 0 表示 256 像素。
    entry[0] = size === 256 ? 0 : size;
    entry[1] = entry[0];
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...icoSizes.map((size) => images.get(size))]);
}

function createIcns(images) {
  const entries = icnsTypes.map(([type, size]) => {
    const png = images.get(size);
    const entry = Buffer.alloc(8);
    entry.write(type, 0, "ascii");
    entry.writeUInt32BE(entry.length + png.length, 4);
    return Buffer.concat([entry, png]);
  });
  const header = Buffer.alloc(8);
  header.write("icns", 0, "ascii");
  header.writeUInt32BE(header.length + entries.reduce((sum, entry) => sum + entry.length, 0), 4);
  return Buffer.concat([header, ...entries]);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length > 1) {
    throw new Error("用法：npm run build:icons [-- 图片路径.png]");
  }
  const inputPath = args[0] ? resolve(args[0]) : sourcePath;
  const source = await readFile(inputPath);
  const image = sharp(source);
  const { format, width, height, pages } = await image.metadata();
  if (format !== "png" || width !== height || width < 256 || (pages ?? 1) > 1) {
    throw new Error("源图必须为至少 256 × 256 的正方形静态 PNG，推荐 1024 × 1024。");
  }
  if (width < 1024) {
    console.warn(`源图为 ${width} × ${height}，大尺寸图标会被放大；推荐使用 1024 × 1024 源图。`);
  }

  const sizes = [...new Set([...icoSizes, ...icnsTypes.map(([, size]) => size)])];
  const images = new Map(
    await Promise.all(
      sizes.map(async (size) => [
        size,
        await image.clone().resize(size, size).ensureAlpha().png().toBuffer()
      ])
    )
  );
  const outputs = [
    [resolve(buildDir, "icon.png"), images.get(512)],
    [resolve(buildDir, "icon.ico"), createIco(images)],
    [resolve(buildDir, "icon.icns"), createIcns(images)]
  ];
  // 自定义输入也同步为运行时源图，保持窗口、托盘和安装包使用同一图标。
  if (inputPath !== sourcePath) {
    outputs.push([sourcePath, source]);
  }
  await mkdir(buildDir, { recursive: true });
  await Promise.all(outputs.map(([path, data]) => writeFile(path, data)));
  for (const [path] of outputs) {
    console.info(`已生成：${path}`);
  }
}

main().catch((error) => {
  console.error(`图标生成失败：${error.message}`);
  process.exitCode = 1;
});
