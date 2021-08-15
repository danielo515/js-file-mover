@module external commondir: array<string> => string = "commondir"

@genType
let determineDestinationPathKeepingFolderStructure = (~destinationFolder, ~fileFullPath) => {
  let commonPath = commondir([destinationFolder, fileFullPath])
  Node.Path.join2(destinationFolder, fileFullPath->Js.String2.replace(commonPath, "./"))
}
