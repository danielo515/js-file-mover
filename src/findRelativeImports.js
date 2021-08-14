import { resolveExtension } from "./resolveFileExtension.js";
import jscodeshift from "jscodeshift";
import path from "path";
import fs from "fs-extra";

const hasSource = ({ source }) =>
  source?.value.startsWith("./") || source?.value.startsWith("../");
/**
 * Reads the file and returns an array of relative import paths
 * with the full path to each file already resolved.
 * @param {string} fileFullPath
 * @return {string[]}
 */
export function findRelativeImports(fileFullPath) {
  const parentPath = path.dirname(fileFullPath);
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
    .map(resolveExtension);

  if (importPaths.length === 0) {
    return [];
  }

  return importPaths.concat(importPaths.map(findRelativeImports)).flat();
}
