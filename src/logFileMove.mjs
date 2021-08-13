import commondir from "commondir";

export function logFileMove(source, destination) {
  const commonPath = commondir([source, destination]);
  const src = chalk.blue(source.replace(commonPath, ""));
  const dest = chalk.green(destination.replace(commonPath, ""));
  console.log(`${src} ${chalk.red("=>")} ${dest}`);
}
