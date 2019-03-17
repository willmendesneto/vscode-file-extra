import { window, MessageItem } from 'vscode';

const showWarningMessage = (
  message: string,
  options: Object = {}
): Promise<MessageItem | undefined> =>
  window.showWarningMessage(message, {
    title: 'OK',
    isCloseAffordance: false,
    ...options,
  }) as Promise<MessageItem | undefined>;

const showInformationMessage = (
  message: string
): Thenable<string | undefined> => window.showInformationMessage(message);

const showInputBox = (
  placeHolder: string,
  filename: string
): Promise<string | undefined> => {
  return window.showInputBox({
    placeHolder,
    value: filename,
  }) as Promise<string | undefined>;
};

export { showInputBox, showWarningMessage, showInformationMessage };
