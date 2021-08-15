#!/usr/bin/env node

import fs from "fs-extra";
import chalk from "chalk";
import path from "path";
import { Command } from "commander";
import { determineDestinationPathKeepingFolderStructure } from "./determineDestinationPath.js";
import { logFileMove } from "./logFileMove.js";
import { findRelativeImports } from "./findRelativeImports.js";
import { confirm } from "./confirm.js";
import pkg from "../package.json";

const program = new Command();
program.version(pkg.version);

program.requiredOption("--dest <path>", "destination folder");
program.parse(process.argv);

const options = program.opts();
// const destinationPath = path.join(process.cwd(), "./client/src/versions/uk/");
const destinationPath = path.join(process.cwd(), options.dest);
const fileArg = program.args[0];

if (!fileArg) {
  console.log(chalk.red("Please provide a file to move"));
  process.exit(1);
}

const fileToMove = path.resolve(fileArg);
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
