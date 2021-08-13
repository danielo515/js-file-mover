#!/usr/bin/env node

import fs from "fs-extra";
import chalk from "chalk";
import path from "path";
import commondir from "commondir";
import jscodeshift from "jscodeshift";
import { logFileMove } from "./logFileMove.mjs";
import { resolveExtension } from "./resolveFileExtension.mjs";

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

function determineDestinationPathKeepingFolderStructure({
  destinationFolder,
  fileFullPath,
}) {
  const commonPath = commondir([destinationFolder, fileFullPath]);
  const destinationFile = path.join(
    destinationPath,
    fileFullPath.replace(commonPath, "./")
  );

  return destinationFile;
}

function confirm() {
  return new Promise((resolve) => {
    process.stdout.write(`\n${chalk.bold.yellow("WARNING")}`);
    process.stdout.write(`\n${chalk.bold.cyan("Move files?")} [Y/n] `);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (data) => {
      if (data.toLowerCase().trim() === "n") {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
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
const operations = [fileToMove, ...findRelativeImports(fileToMove)].map(
  (file) => {
    const newPath = determineDestinationPathKeepingFolderStructure({
      destinationFolder: destinationPath,
      fileFullPath: file,
    });
    logFileMove(file, newPath);
    return [file, newPath];
  }
);

confirm()
  .then((doIt) => {
    if (!doIt) {
      return console.log(chalk.red("Operation cancelled"));
    }
    return operations.forEach(([file, newPath]) => {
      fs.moveSync(file, newPath);
    });
  })
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
