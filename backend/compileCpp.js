const util = require('util');
const exec = util.promisify(require('child_process').exec);

exports.default = async (filename) => {
    try {
        await exec(`g++ -std=c++17 -O3 -static -o ./cpp/test.bin ${filename}`);
        return "./cpp/test.bin"
    } catch (err) {
        throw err.stderr
    }
}