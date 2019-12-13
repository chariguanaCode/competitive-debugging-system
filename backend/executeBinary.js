const util = require('util');
const exec = util.promisify(require('child_process').exec);

exports.default = async (binaryName) => {
    try {
        const { stdout, stderr } = await exec(`./${binaryName}`);
        return { stdout, stderr }
    } catch (err) {
        throw err.stderr
    }
}