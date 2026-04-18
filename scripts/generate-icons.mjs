import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#1976d2"/>
  <g stroke="#fff" stroke-width="6" opacity="0.85">
    <line x1="170" y1="80" x2="170" y2="432"/>
    <line x1="342" y1="80" x2="342" y2="432"/>
    <line x1="80" y1="170" x2="432" y2="170"/>
    <line x1="80" y1="342" x2="432" y2="342"/>
  </g>
  <text x="256" y="320" text-anchor="middle" font-family="Hiragino Sans, sans-serif"
        font-size="220" fill="#fff" font-weight="900">数</text>
</svg>
`;

const sizes = [192, 512];
for (const size of sizes) {
  const out = `public/icons/icon-${size}.png`;
  mkdirSync(dirname(out), { recursive: true });
  await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer().then((buf) => {
    writeFileSync(out, buf);
    console.log(`wrote ${out}`);
  });
}

await sharp(Buffer.from(svg)).resize(180, 180).png().toBuffer().then((buf) => {
  writeFileSync('public/apple-touch-icon.png', buf);
  console.log('wrote public/apple-touch-icon.png');
});
