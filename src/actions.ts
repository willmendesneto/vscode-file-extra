import {
  TextEditor,
  TextDocument,
  workspace,
  commands,
  window as vsWindow,
} from 'vscode';
import { parse } from 'path';
import * as fs from 'fs-extra';
import { writeSync as writeToClipboard } from 'clipboardy';
import { ActionParams, CopyOptions } from './types';
import { buildFilepath } from './helpers/files';
import {
  showInputBox,
  showWarningMessage,
  showInformationMessage,
} from './helpers/prompt';
import { errorMessage } from './helpers/error-message';
import {
  removeFirstSlashInString,
  removeLastSlashInString,
  removeWorkspaceUrlRootFromUrl,
  getWorkspaceUrlRootFromUrl,
} from './helpers/string-manipulations';

const filePathExists = async (newPath: string): Promise<boolean> => {
  // Check if the current path exists
  const newPathExists = await fs.pathExists(newPath);
  return !!newPathExists;
};

/**
 * Open file after duplicate action.
 */
const openFile = async (filepath: string): Promise<TextEditor> => {
  const document = await (workspace.openTextDocument(filepath) as Promise<
    TextDocument
  >);
  await commands.executeCommand('workbench.files.action.refreshFilesExplorer');

  return vsWindow.showTextDocument(document);
};

/**
 * Duplicate action.
 */
const duplicate = async ({
  uri,
  workspaceFolders,
  settings,
}: ActionParams): Promise<TextEditor | undefined> => {
  const oldPath = uri.fsPath;
  const oldPathParsed = parse(oldPath);

  const workspaceRootPath = getWorkspaceUrlRootFromUrl(
    workspaceFolders,
    oldPathParsed.dir
  );

  try {
    const oldPathStats = await fs.stat(oldPath);
    // Add extension if is a file
    const extension = oldPathStats.isFile() ? oldPathParsed.ext : '';
    const workspaceLocation = oldPathParsed.dir.replace(workspaceRootPath, '');

    const newFileWithoutRoot = removeFirstSlashInString(
      `${workspaceLocation}/${removeLastSlashInString(
        oldPathParsed.name
      )}${extension}`
    );
    // Get a new name for the resource
    const newName = await showInputBox(
      'Enter the new path for the duplicate.',
      newFileWithoutRoot
    );

    if (!newName) {
      return;
    }
    // Get the new full path
    const newPath = buildFilepath(newName, workspaceRootPath);

    // If a user tries to copy a file on the same path
    if (oldPath === newPath) {
      vsWindow.showErrorMessage(
        "You can't copy a file or directory on the same path."
      );

      return;
    }

    const newPathExists = await filePathExists(newPath);

    // Check if the current path exists
    if (newPathExists) {
      const newPathStats = await fs.stat(newPath);
      if (!newPathStats.isFile()) {
        await showInformationMessage(`**${newPath}** alredy exists.`);
        return;
      }

      const userAnswer = await showWarningMessage(
        `**${newPath}** alredy exists. Do you want to overwrite?`
      );
      if (!userAnswer) {
        return;
      }
    }

    const newPathParsed = parse(newPath);
    await fs.ensureDir(newPathParsed.dir);
    await fs.copy(oldPath, newPath);

    if (settings.openFileAfterDuplication && oldPathStats.isFile()) {
      return openFile(newPath);
    }
  } catch (err) {
    errorMessage(err);
  }

  return;
};

/**
 * Remove action.
 */
const remove = async ({
  uri,
  settings,
}: ActionParams): Promise<TextEditor | undefined> => {
  try {
    await fs.removeSync(uri.fsPath);
    await commands.executeCommand(
      'workbench.files.action.refreshFilesExplorer'
    );

    if (settings.closeFileAfterRemove) {
      await commands.executeCommand('workbench.action.closeActiveEditor');
    }
  } catch (err) {
    errorMessage(err);
  }

  return;
};

/**
 * Rename action.
 */
const renameFile = async ({
  uri,
  workspaceFolders,
}: ActionParams): Promise<TextEditor | undefined> => {
  try {
    const oldPath = uri.fsPath;
    const oldPathParsed = parse(oldPath);
    const oldPathStats = await fs.stat(oldPath);
    const workspaceRootPath = getWorkspaceUrlRootFromUrl(
      workspaceFolders,
      oldPathParsed.dir
    );

    // Add extension if is a file
    const extension = oldPathStats.isFile() ? oldPathParsed.ext : '';

    const newFileWithoutRoot = removeFirstSlashInString(
      `${removeWorkspaceUrlRootFromUrl(
        workspaceFolders,
        oldPathParsed.dir
      )}/${removeLastSlashInString(oldPathParsed.name)}${extension}`
    );

    // Get a new name for the resource
    const newName = await showInputBox(
      'Enter the new file or folder name.',
      newFileWithoutRoot
    );
    if (!newName) {
      return;
    }
    // Get the new full path
    const newPath = buildFilepath(newName, workspaceRootPath);

    // If a user tries to copy a file on the same path
    if (oldPath === newPath) {
      return;
    }

    // Check if the current path exists
    const newPathExists = await filePathExists(newPath);

    if (newPathExists) {
      const newPathStats = await fs.stat(newPath);
      if (!newPathStats.isFile()) {
        await showInformationMessage(`**${newPath}** alredy exists.`);
        return;
      }

      const userAnswer = await showWarningMessage(
        `**${newPath}** alredy exists. Do you want to overwrite?`
      );
      if (!userAnswer) {
        return;
      }
    }

    const newPathParsed = parse(newPath);
    await fs.ensureDir(newPathParsed.dir);
    await fs.rename(oldPath, newPath);
    await commands.executeCommand('workbench.action.closeActiveEditor');
    return openFile(newPath);
  } catch (err) {
    errorMessage(err);
  }

  return;
};

/**
 * Create action.
 */
const add = async ({
  uri,
  workspaceFolders,
}: ActionParams): Promise<TextEditor | undefined> => {
  const oldPath = uri.fsPath;
  const oldPathParsed = parse(oldPath);

  const workspaceRootPath = getWorkspaceUrlRootFromUrl(
    workspaceFolders,
    oldPathParsed.dir
  );

  try {
    const newFileWithoutRoot = removeFirstSlashInString(
      removeWorkspaceUrlRootFromUrl(workspaceFolders, oldPathParsed.dir)
    );
    // Get a new name for the resource
    const newFilename = await showInputBox(
      'Enter the new file or folder name.',
      newFileWithoutRoot
    );

    if (!newFilename) {
      return;
    }

    // Get the new full path
    const newPath = buildFilepath(newFilename, workspaceRootPath);
    // Check if the current path exists
    const newPathExists = await filePathExists(newPath);
    const newPathParsed = parse(newPath);

    // Check if new file is a hidden file
    const isAHiddenFile = newPathParsed.name.startsWith('.');

    if (newPathExists) {
      if (!newPathParsed.ext) {
        await showInformationMessage(`**${newPath}** alredy exists.`);
        return;
      }

      const userAnswer = await showWarningMessage(
        `**${newPath}** alredy exists. Do you want to overwrite?`
      );
      if (!userAnswer) {
        return;
      }
    }

    await fs.ensureDir(newPathParsed.dir);
    if (!!newPathParsed.ext || isAHiddenFile) {
      await fs.createFileSync(newPath);
    }

    if (!!newPathParsed.ext || isAHiddenFile) {
      const newPathStats = await fs.stat(newPath);

      if (newPathStats.isFile()) {
        return openFile(newPath);
      }
    }

    await commands.executeCommand(
      'workbench.files.action.refreshFilesExplorer'
    );
  } catch (err) {
    errorMessage(err);
  }

  return;
};

const copyTextContent = (fileUrl: string) => {
  writeToClipboard(fileUrl);
  return showInformationMessage(`**${fileUrl}** copied.`);
};

const copyFileUrl = async (
  { uri, workspaceFolders }: ActionParams,
  { removeRoot }: CopyOptions
) => {
  try {
    const fileUrl = removeRoot
      ? removeFirstSlashInString(
          removeWorkspaceUrlRootFromUrl(workspaceFolders, uri.fsPath)
        )
      : uri.fsPath;

    return copyTextContent(fileUrl);
  } catch (error) {
    errorMessage(error);
  }
};

const copyRelativeFilePath = async (params: ActionParams) => {
  const copyOptions: CopyOptions = { removeRoot: true };
  return copyFileUrl(params, copyOptions);
};

const copyFilePath = async (params: ActionParams) => {
  const copyOptions: CopyOptions = { removeRoot: false };
  return copyFileUrl(params, copyOptions);
};

const copyFileName = async (params: ActionParams) => {
  try {
    const fileUrl = params.uri.fsPath;

    if (fileUrl.toLowerCase().match(/^untitled-(\d*)$/g)) {
      throw new Error(
        `**${fileUrl}** is not saved. Please make sure you saved the file before save`
      );
    }

    const filePathStats = await fs.stat(fileUrl);
    if (!filePathStats.isFile()) {
      throw new Error(`**${fileUrl}** is not a file and can not be copied`);
    }

    const filePathParsed = parse(fileUrl);
    const filename = `${filePathParsed.name}${filePathParsed.ext}`;

    return copyTextContent(filename);
  } catch (error) {
    errorMessage(error);
  }
};

export {
  duplicate,
  remove,
  renameFile,
  add,
  copyRelativeFilePath,
  copyFilePath,
  copyFileName,
};
