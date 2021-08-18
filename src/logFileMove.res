@module external commondir: array<string> => string = "commondir"

let logFileMove = (~source, ~destination) => {
  let commonPath = commondir([source, destination])
  let src = Chalk.blue(source->Js.String2.replace(commonPath, ""))
  let dest = Chalk.green(destination->Js.String2.replace(commonPath, ""))
  Js.log(`${src} ${Chalk.red("=>")} ${dest}`)
}
