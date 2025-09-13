const { unlinkSync, existsSync, readdirSync } = require("fs");
const { join, dirname } = require("path");

function cleanupUws() {
    let directory;

    try {
        const main = require.resolve("uWebSockets.js");
        directory = dirname(main);
        console.log(`Found uWebSockets.js directory at: ${directory}`);
    } catch (e) {
        console.error("❌ Package 'uWebSockets.js' not found. Please run 'npm install' or 'yarn install' first.");
        return;
    }

    const platform = process.platform;
    const arch = process.arch;
    const modules = process.versions.modules;
    const keep = `uws_${platform}_${arch}_${modules}.node`;

    console.log(`\n🤔 System Info (The correct binary to keep is: ${keep})`);
    console.log(`  - Platform: ${platform}`);
    console.log(`  - Architecture: ${arch}`);
    console.log(`  - Node Modules Version: ${modules}\n`);

    if (!existsSync(join(directory, keep))) {
        console.error(`🛑 FATAL ERROR: The required binary '${keep}' was not found!`);
        console.error("  - This might mean that the uWebSockets.js installation is corrupted or incompatible with your system.");
        console.error("  - Aborting cleanup to prevent breaking the package. No files were deleted.");
        console.error("  - Try reinstalling the package 'uWebSockets.js'!");
        return;
    }

    console.log("✅ Required binary found. Starting cleanup of other versions...");
    const files = readdirSync(directory);

    files.forEach(file => {
        if (file.startsWith("uws_") && file.endsWith(".node")) {
            if (file === keep) {
                console.log(`👍 Keeping: ${file}`);
            } else {
                const path = join(directory, file);
                try {
                    unlinkSync(path);
                    console.log(`🗑️ Deleted: ${file}`);
                } catch (err) {
                    console.error(`Error while deleting ${file}: ${err.message}`);
                }
            }
        }
    });

    console.log("\n✨ Cleanup complete!");
}

cleanupUws();
