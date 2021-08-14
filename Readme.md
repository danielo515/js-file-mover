# js-file-mover
Have you ever had the need to move a javascript file from one folder to another?
Yes, you can use your IDE to do this and let it manage the imports to that file.
However, what if you want to move a file along with its imports? Then you will have to move the file, wait for the imports to be updated
and then move the imports.
This CLI tool will help you to move a file along with all its local imports and it will do it while retaining the same folder structure.
This tool is specially useful when you want to move just a single file with its dependencies and not the whole folder.


## Usage

The recommended way is to just use npx to use this module without installation.

```bash
npx js-file-mover path/to/source
```