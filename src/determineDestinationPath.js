import path from "path";
import commondir from "commondir";

export function determineDestinationPathKeepingFolderStructure({
  destinationFolder,
  fileFullPath,
}) {
  const commonPath = commondir([destinationFolder, fileFullPath]);
  const destinationFile = path.join(
    destinationFolder,
    fileFullPath.replace(commonPath, "./")
  );
  return destinationFile;
}
