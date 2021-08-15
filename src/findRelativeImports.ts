import { resolveExtension } from "./resolveFileExtension";
import jscodeshift from "jscodeshift";
import path from "path";
import fs from "fs-extra";

const hasSource = ({ source }) =>
  source?.value.startsWith("./") || source?.value.startsWith("../");

function isStyleFile(filePath: string) {
  return [".scss", ".sass"].includes(path.extname(filePath));
}

function _findRelativeImports(
  fileFullPath: string,
  accPaths: string[]
): string[] {
  console.log({ fileFullPath, accPaths });
  const parentPath = path.dirname(fileFullPath);
  if (isStyleFile(fileFullPath)) return accPaths; // skip import lookup on style files
  const sourceCode = fs.readFileSync(fileFullPath, "utf8");
  const ast = jscodeshift.withParser("tsx")(sourceCode);
  const paths = ast.find(jscodeshift.ImportDeclaration, hasSource);
  const exportPaths = ast
    .find(jscodeshift.ExportNamedDeclaration, hasSource)
    .paths();

  const importPaths = paths
    .paths()
    .concat(exportPaths)
    .map(({ value }) => value.source.value)
    .map((importPath) => path.join(parentPath, importPath))
    .map(resolveExtension)
    .filter((importPath) => !accPaths.includes(importPath)); //avoid circular imports

  if (importPaths.length === 0) {
    return accPaths;
  }

  const result = importPaths
    .map((importPath) => {
      return _findRelativeImports(importPath, accPaths.concat(importPaths));
    })
    .flat();

  return result;
}

/**
 * Reads the file and returns an array of relative import paths
 * with the full path to each file already resolved.
 * @param {string} fileFullPath
 * @return {string[]}
 */
export function findRelativeImports(fileFullPath) {
  return _findRelativeImports(fileFullPath, []);
}
