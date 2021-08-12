#!/usr/bin/env node

import fs from "fs-extra";
import chalk from "chalk";
import path from "path";
import commondir from "commondir";
import jscodeshift from "jscodeshift";

const jsExtensions = [".js", ".jsx", ".ts", ".tsx"];

/**
 * Given a file path without extension
 * it determines the extension of the file by checking that the file exists
 * and returns the full path with the extension.
 * @param {string} filePath
 * @return {string}
 */
function resolveExtension(filePath) {
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

/**
 * Reads the file and returns an array of relative import paths
 * with the full path to each file already resolved.
 * @param {string} fileFullPath
 * @return {string[]}
 */
function findRelativeImports(fileFullPath) {
  const parentPath = path.dirname(fileFullPath);
  const sourceCode = fs.readFileSync(fileFullPath, "utf8");
  const ast = jscodeshift.withParser("tsx")(sourceCode);
  const paths = ast.find(
    jscodeshift.ImportDeclaration,
    ({ source: { value } }) => value.startsWith("./") || value.startsWith("../")
  );
  const importPaths = paths
    .paths()
    .map(({ value }) => value.source.value)
    .map((importPath) => path.join(parentPath, importPath))
    .map(resolveExtension);
  if (importPaths.length === 0) {
    return [];
  }
  return importPaths.concat(importPaths.map(findRelativeImports)).flat();
}

function determineDestinationPathKeepingFolderStructure(
  destinationFolder,
  fileFullPath
) {
  const commonPath = commondir([destinationFolder, fileFullPath]);
  console.log(`commonPath`, commonPath);
  const destinationFile = path.join(
    destinationPath,
    fileFullPath.replace(commonPath, "./")
  );

  return destinationFile;
}

function logFileMove(source, destination) {
  const commonPath = commondir([source, destination]);
  const src = chalk.blue(source.replace(commonPath, "./"));
  const dest = chalk.green(destination.replace(commonPath, "./"));
  console.log(`${src} ${chalk.red("=>")} ${dest}`);
}

const destinationPath = path.join(process.cwd(), "./client/src/versions/uk/");

const fileArg = process.argv[2];

if (!fileArg) {
  console.log(chalk.red("Please provide a file to move"));
  process.exit(1);
}

const fileToMove = path.resolve(process.argv[2]);
console.log("File to move", chalk.green(`${fileToMove}`));
console.log(chalk.blue("Moving files"));
[fileToMove, ...findRelativeImports(fileToMove)].forEach((file) => {
  const newPath = determineDestinationPathKeepingFolderStructure(file);
  logFileMove(file, newPath);
  fs.moveSync(file, newPath);
});
