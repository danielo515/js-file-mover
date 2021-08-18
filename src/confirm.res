@val external write: string => unit = "process.stdout.write"
@val external resume: unit => unit = "process.stdin.resume"
@val external onData: (@as("data") _, Node.Buffer.t => unit) => unit = "process.stdin.on"
@scope("process.stdin") @val external setUtf8Encoding: (@as("utf8") _, unit) => unit = "setEncoding"

let confirm = () => {
  open Js.Promise
  make((~resolve, ~reject as _) => {
    write(`\n${Chalk.bold->Chalk.bold_yellow("WARNING")}`)
    write(`\n${Chalk.bold->Chalk.bold_cyan("Move files?")} [Y/n] `)
    resume()
    setUtf8Encoding()
    onData(data => {
      let asString = data->Node.Buffer.toString->Js.String2.toLowerCase->Js.String.trim
      if asString === "n" {
        resolve(. false)
      } else {
        resolve(. true)
      }
    })
  })
}
