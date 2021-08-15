@module external commondir: array<string> => string = "commondir"

let determineDestinationPathKeepingFolderStructure = (~destinationFolder, ~fileFullPath) => {
  let commonPath = commondir([destinationFolder, fileFullPath])
  Node.Path.join2(destinationFolder, fileFullPath->Js.String2.replace(commonPath, "./"))
}
