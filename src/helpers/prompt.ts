import * as vscode from 'vscode';

const showWarningMessage = (
  message: string,
  options: Object = {}
): Promise<vscode.MessageItem | undefined> => {
  const action = {
    title: 'OK',
    isCloseAffordance: false,
    ...options,
  };

  return vscode.window.showWarningMessage(message, action) as Promise<
    vscode.MessageItem | undefined
  >;
};

const showInformationMessage = (
  message: string
): Promise<vscode.MessageItem | undefined> => {
  return vscode.window.showInformationMessage(message) as Promise<
    vscode.MessageItem | undefined
  >;
};

const showInputBox = (
  placeHolder: string,
  filename: string
): Promise<string | undefined> => {
  return vscode.window.showInputBox({
    placeHolder,
    value: filename,
  }) as Promise<string | undefined>;
};

export { showInputBox, showWarningMessage, showInformationMessage };
