/* TypeScript file generated from determineDestinationPath.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
import * as Curry__Es6Import from 'rescript/lib/es6/curry.js';
const Curry: any = Curry__Es6Import;

// @ts-ignore: Implicit any on import
import * as determineDestinationPathBS__Es6Import from './determineDestinationPath.bs';
const determineDestinationPathBS: any = determineDestinationPathBS__Es6Import;

export const determineDestinationPathKeepingFolderStructure: (_1:{ readonly destinationFolder: string; readonly fileFullPath: string }) => string = function (Arg1: any) {
  const result = Curry._2(determineDestinationPathBS.determineDestinationPathKeepingFolderStructure, Arg1.destinationFolder, Arg1.fileFullPath);
  return result
};
