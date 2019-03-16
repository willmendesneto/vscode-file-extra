import * as vscode from 'vscode';

export function name(filename: string): Promise<string | undefined> {
    return vscode.window.showInputBox({
        placeHolder: 'Enter the new path for the duplicate.',
        value: filename.split('.').map((el, i) => i === 0 ? `${el}-yeah-huehue` : el).join('.')
    }) as Promise<string | undefined>;
}

export function overwrite(filepath: string): Promise<vscode.MessageItem | undefined> {
    const message = `The path **${filepath}** alredy exists. Do you want to overwrite the existing path?`;
    const action = {
        title: 'OK',
        isCloseAffordance: false
    };

    return vscode.window.showWarningMessage(message, action) as Promise<vscode.MessageItem | undefined>;
}


export function remove(filepath: string): Promise<vscode.MessageItem | undefined> {
    const message = `Do you want to remove the existing path?`;
    const action = {
        title: 'OK',
        isCloseAffordance: false
    };

    return vscode.window.showWarningMessage(message, action) as Promise<vscode.MessageItem | undefined>;
}
