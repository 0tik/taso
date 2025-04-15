const fs = require("fs");
const path = require("path");
const tinify = require("tinify");

tinify.key = "wnddtjfDZrfztQcZqMB9ZBQJ6CBqWhLy"; // Replace with your actual Tinify API key

const folderPath = path.join(__dirname, "gallery", "5");

fs.readdir(folderPath, (err, files) => {
    if (err) return console.error("❌ Error reading folder:", err);

    files.forEach((file) => {
        const filePath = path.join(folderPath, file);

        // Skip if filename includes "thumb" or doesn't match numbered jpg format
        if (/thumb/i.test(file) || !/^\d+\.jpe?g$/i.test(file)) {
            return;
        }

        tinify.fromFile(filePath).toFile(filePath)
            .then(() => {
                console.log(`✅ Compressed: ${file}`);
            })
            .catch((error) => {
                console.error(`❌ Error compressing ${file}:`, error.message);
            });
    });
});
