@module external commondir: array<string> => string = "commondir"

type options = {destinationFolder: string, fileFullPath: string}

let determineDestinationPathKeepingFolderStructure = (options: options) => {
  let destinationFolder = options.destinationFolder
  let fileFullPath = options.fileFullPath
  let commonPath = commondir([destinationFolder, fileFullPath])
  Node.Path.join2(destinationFolder, fileFullPath->Js.String2.replace(commonPath, "./"))
}
