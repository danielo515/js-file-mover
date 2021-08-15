import path from "path";
import { Command } from "commander";
import pkg from "../package.json";
import chalk from "chalk";

export function getArguments() {
  const program = new Command();
  program
    .version(pkg.version)
    .requiredOption("--dest <path>", "destination folder")
    .parse(process.argv);

  const options = program.opts();
  const destinationPath = path.join(process.cwd(), options.dest);
  const fileArg = program.args[0];

  if (!fileArg) {
    console.log(chalk.red("Please provide a file to move"));
    process.exit(1);
  }

  const fileToMove = path.resolve(fileArg);
  return {
    destinationPath,
    fileToMove,
  };
}
