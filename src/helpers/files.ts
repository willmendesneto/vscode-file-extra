import { commands, window, workspace, TextEditor, TextDocument } from 'vscode';

import { pathExists } from 'fs-extra';
import { showWarningMessage } from './prompt';

const filePathExists = async (newPath: string): Promise<boolean> => {
    // Check if the current path exists
    const newPathExists = await pathExists(newPath);
    if (newPathExists) {
        const userAnswer = await showWarningMessage(`The path **${newPath}** alredy exists. Do you want to overwrite the existing path?`);
        return !!userAnswer;
    }

    return !!newPathExists;
};

/**
 * Open file after duplicate action.
 */
const openFile = async (filepath: string): Promise<TextEditor> => {
    const document = await (workspace.openTextDocument(filepath) as Promise<TextDocument>);
    await commands.executeCommand('workbench.files.action.refreshFilesExplorer');

    return window.showTextDocument(document);
};

const buildFilepath = (
    newName: string,
    workspaceRootPath: string,
): string => {
    return `${workspaceRootPath}/${newName}`;
};


export { filePathExists, openFile, buildFilepath };