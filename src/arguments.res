type t = {args: array<option<string>>}
type opt = {dest: string}
@module("commander") @new external command: unit => t = "Command"
@send external version: (t, string) => t = "version"
@send external parse: (t, array<string>) => t = "parse"
@send external opts: t => opt = "opts"
@module("path") external resolve: string => string = "resolve"

let getArguments = () => {
  let program = command()->version("0.0.1")->parse(Node_process.argv)

  let options = program->opts
  let fileArg = program.args->Js.Array2.unsafe_get(0)
  let fileToMove = switch fileArg {
  | Some(path) => resolve(path)
  | _ => {
      Js.log(Chalk.red(`No file specified. Please provide a file name to move`))
      Node.Process.exit(1)
    }
  }

  let destinationPath = Node.Path.join2(Node.Process.cwd(), options.dest)

  {
    "destinationPath": destinationPath,
    "fileToMove": fileToMove,
  }
}
