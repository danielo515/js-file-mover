import chalk from "chalk";

export function confirm() {
  return new Promise((resolve) => {
    process.stdout.write(`\n${chalk.bold.yellow("WARNING")}`);
    process.stdout.write(`\n${chalk.bold.cyan("Move files?")} [Y/n] `);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (data) => {
      if (data.toString().toLowerCase().trim() === "n") {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}
