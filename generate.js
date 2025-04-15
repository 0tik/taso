const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const galleryPath = path.join(__dirname, 'gallery');

fs.readdir(galleryPath, (err, folders) => {
    if (err) return console.error('Failed to read gallery folder:', err);

    folders.forEach(folder => {
        const folderPath = path.join(galleryPath, folder);

        if (!fs.lstatSync(folderPath).isDirectory()) return;

        fs.readdir(folderPath, (err, files) => {
            if (err) return console.error('Failed to read folder:', folderPath, err);

            files
                .filter(file => /^\d+\.jpg$/i.test(file))
                .forEach(file => {
                    const inputPath = path.join(folderPath, file);
                    const outputPath = path.join(folderPath, file.replace('.jpg', '_thumb.jpg'));

                    sharp(inputPath)
                        .resize({ width: 1000 }) // resize to around 1000px width
                        .jpeg({ quality: 70 }) // reduce quality to ~70% to save size
                        .toFile(outputPath)
                        .then(() => {
                            console.log(`Thumbnail created for ${file}`);
                        })
                        .catch(err => {
                            console.error(`Error processing ${file}:`, err);
                        });
                });
        });
    });
});
