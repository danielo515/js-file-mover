#!/usr/bin/env node

import fs from "fs-extra";
import chalk from "chalk";
import { determineDestinationPathKeepingFolderStructure } from "./determineDestinationPath";
import { logFileMove } from "./logFileMove";
import { confirm } from "./confirm";
import { getArguments } from "./arguments";
import { findRelativeImports } from "./findRelativeImports";

const { fileToMove, destinationPath } = getArguments();

console.log("File to move", chalk.green(`${fileToMove}`));
console.log("Destination ", chalk.green(`${destinationPath}`));
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
