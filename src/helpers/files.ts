import { commands, window, workspace, TextEditor, TextDocument } from 'vscode';

/**
 * Open file after duplicate action.
 */
const openFile = async (filepath: string): Promise<TextEditor> => {
  const document = await (workspace.openTextDocument(
    filepath
  ) as Promise<TextDocument>);
  await commands.executeCommand('workbench.files.action.refreshFilesExplorer');

  return window.showTextDocument(document);
};

const buildFilepath = (newName: string, workspaceRootPath: string): string => {
  return `${workspaceRootPath}/${newName}`;
};

export { openFile, buildFilepath };
