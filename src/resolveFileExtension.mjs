import fs from "fs-extra";
import path from "path";

const jsExtensions = [".js", ".jsx", ".ts", ".tsx"];

/**
 * Given a file path without extension
 * it determines the extension of the file by checking that the file exists
 * and returns the full path with the extension.
 * @param {string} filePath
 * @return {string}
 */
export function resolveExtension(filePath) {
  const ext = path.extname(filePath);
  if (jsExtensions.includes(ext)) {
    return filePath + ext;
  }

  return jsExtensions
    .map((ext) => filePath + ext) // add all extensions
    .reduce((finalPath, current) => {
      if (fs.pathExistsSync(current)) {
        return current;
      }
      return finalPath;
    });
}
