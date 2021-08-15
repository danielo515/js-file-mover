import fs from "fs-extra";
import path from "path";

const jsExtensions = [".js", ".jsx", ".ts", ".tsx", ".scss"];

/**
 * Given a file path (potentially) without extension
 * it determines the extension of the file by checking that the file exists
 * and returns the full path with the extension.
 * @param {string} filePath the full path to the file
 * @return {string[]}
 */
export function resolveExtension(filePath) {
  const dirname = path.dirname(filePath);
  const allFiles = fs.readdirSync(dirname);
  return allFiles.reduce((acc, file) => {
    if (jsExtensions.includes(path.extname(file))) {
      acc.push(path.join(dirname, file));
    }
    return acc;
  }, []);
}
