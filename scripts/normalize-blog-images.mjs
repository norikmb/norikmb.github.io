import { readdir, rename } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const blogImageDirectory = fileURLToPath(new URL('../public/blog/', import.meta.url));
const imageFiles = (await readdir(blogImageDirectory, { withFileTypes: true }))
	.filter((entry) => entry.isFile() && /\.(png|jpe?g|webp|avif)$/i.test(entry.name))
	.map((entry) => entry.name);

let converted = 0;

for (const imageFile of imageFiles) {
	const imagePath = path.join(blogImageDirectory, imageFile);
	const image = sharp(imagePath);
	const { width, height, format } = await image.metadata();

	if (width === 1200 && height === 630) {
		continue;
	}

	let output = image.rotate().resize(1200, 630, {
		fit: 'contain',
		background: '#fff',
	});

	if (format === 'png') {
		output = output.flatten({ background: '#fff' }).png();
	} else if (format === 'webp') {
		output = output.flatten({ background: '#fff' }).webp({ quality: 92 });
	} else if (format === 'avif') {
		output = output.flatten({ background: '#fff' }).avif({ quality: 92 });
	} else {
		output = output.flatten({ background: '#fff' }).jpeg({ quality: 92 });
	}

	await output.toFile(`${imagePath}.tmp`);
	await rename(`${imagePath}.tmp`, imagePath);
	converted += 1;
}

console.log(`Normalized ${converted} blog images to 1200x630.`);
