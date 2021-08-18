@module("chalk") external red: string => string = "red"
@module("chalk") external blue: string => string = "blue"
@module("chalk") external green: string => string = "green"
type bold
@module("chalk") external bold: bold = "bold"
@send external bold_yellow: (bold, string) => string = "yellow"
@send external bold_cyan: (bold, string) => string = "cyan"
module Bold = {
  @val external cyan: string => string = "Chalk.bold.cyan"
}
