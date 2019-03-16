import { TextEditor, TextDocument, workspace, commands, window as vsWindow } from 'vscode';
import { parse } from 'path';
import { pathExists, stat, ensureDir, copy, createFileSync, rename as rename, removeSync } from 'fs-extra';
import { ActionParams } from './types';
import { buildFilepath } from './helpers/files';
import { showInputBox, showWarningMessage, showInformationMessage } from './helpers/prompt';
import { errorMessage } from './helpers/error-message';
import { removeFirstSlashInString, removeLastSlashInString } from './helpers/string-manipulations';

const filePathExists = async (newPath: string): Promise<boolean> => {
    // Check if the current path exists
    const newPathExists = await pathExists(newPath);
    return !!newPathExists;
};

/**
 * Open file after duplicate action.
 */
const openFile = async (filepath: string): Promise<TextEditor> => {
    const document = await (workspace.openTextDocument(filepath) as Promise<TextDocument>);
    await commands.executeCommand('workbench.files.action.refreshFilesExplorer');

    return vsWindow.showTextDocument(document);
};

/**
 * Duplicate action.
 */
const duplicate = async ({
    uri,
    workspaceRootPath = '',
    settings,
}: ActionParams): Promise<TextEditor | undefined> => {
    const oldPath = uri.fsPath;
    const oldPathParsed = parse(oldPath);

    try {
        const oldPathStats = await stat(oldPath);
        // Add extemsion if is a file
        const extension = oldPathStats.isFile() ? oldPathParsed.ext : '';
        const workspaceLocation = oldPathParsed.dir.replace(workspaceRootPath, '');

        const newFileWithoutRoot = removeFirstSlashInString(
            `${workspaceLocation}/${removeLastSlashInString(oldPathParsed.name)}${extension}`
        );
        // Get a new name for the resource
        const newName = await showInputBox('Enter the new path for the duplicate.', newFileWithoutRoot);
        if (!newName) {
            return;
        }
        // Get the new full path
        const newPath = buildFilepath(newName, workspaceRootPath);

        // If a user tries to copy a file on the same path
        if (oldPath === newPath) {
            vsWindow.showErrorMessage('You can\'t copy a file or directory on the same path.');

            return;
        }

        // Check if the current path exists
        const newPathStats = await stat(newPath);
        const newPathExists = await filePathExists(newPath);

        if (newPathExists) {
            if (!newPathStats.isFile()) {
                await showInformationMessage(`**${newPath}** alredy exists.`);
                return;
            }

            const userAnswer = await showWarningMessage(`**${newPath}** alredy exists. Do you want to overwrite?`);
            if (!userAnswer) {
                return;
            }
        }

        const newPathParsed = parse(newPath);
        await ensureDir(newPathParsed.dir);
        await copy(oldPath, newPath);

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
        await removeSync(uri.fsPath);
        await commands.executeCommand('workbench.files.action.refreshFilesExplorer');

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
    workspaceRootPath = '',
    settings,
}: ActionParams): Promise<TextEditor | undefined> => {

    try {
        const oldPath = uri.fsPath;
        const oldPathParsed = parse(oldPath);
        const oldPathStats = await stat(oldPath);

        // Add extemsion if is a file
        const extension = oldPathStats.isFile() ? oldPathParsed.ext : '';

        const newFileWithoutRoot = removeFirstSlashInString(
            `${oldPathParsed.dir.replace(workspaceRootPath, '')}/${removeLastSlashInString(oldPathParsed.name)}${extension}`
        );
        // Get a new name for the resource
        const newName = await showInputBox('Enter the new file or folder name.', newFileWithoutRoot);
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
        const newPathStats = await stat(newPath);

        if (newPathExists) {
            if (!newPathStats.isFile()) {
                await showInformationMessage(`**${newPath}** alredy exists.`);
                return;
            }

            const userAnswer = await showWarningMessage(`**${newPath}** alredy exists. Do you want to overwrite?`);
            if (!userAnswer) {
                return;
            }
        }

        const newPathParsed = parse(newPath);
        await ensureDir(newPathParsed.dir);
        await rename(oldPath, newPath);
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
    workspaceRootPath = '',
}: ActionParams): Promise<TextEditor | undefined> => {

    const oldPath = uri.fsPath;
    const oldPathParsed = parse(oldPath);

    try {

        const newFileWithoutRoot = removeLastSlashInString(
            removeFirstSlashInString(
                `${oldPathParsed.dir.replace(workspaceRootPath, '')}`
            )
        );
        // Get a new name for the resource
        const newFilename = await showInputBox('Enter the new file or folder name.', newFileWithoutRoot);

        if (!newFilename) {
            return;
        }

        // Get the new full path
        const newPath = buildFilepath(newFilename, workspaceRootPath);
        // Check if the current path exists
        const newPathStats = await stat(newPath);
        const newPathExists = await filePathExists(newPath);

        if (newPathExists) {
            if (!newPathStats.isFile()) {
                await showInformationMessage(`**${newPath}** alredy exists.`);
                return;
            }

            const userAnswer = await showWarningMessage(`**${newPath}** alredy exists. Do you want to overwrite?`);
            if (!userAnswer) {
                return;
            }
        }

        const newPathParsed = parse(newPath);

        await ensureDir(newPathParsed.dir);
        if (!!newPathParsed.ext) {
            await createFileSync(newPath);
        }

        if (!!newPathParsed.ext && newPathStats.isFile()) {
            return openFile(newPath);
        }

        await commands.executeCommand('workbench.files.action.refreshFilesExplorer');
    } catch (err) {
        errorMessage(err);
    }

    return;
};

export { duplicate, remove, renameFile, add };