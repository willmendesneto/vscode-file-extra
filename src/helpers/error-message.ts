import { window as vsWindow } from 'vscode';

const errorMessage = (err: Error) => {
    const errMsg = err.message
        .replace(/[\\|\/]/g, '')
        .replace(/`|'/g, '**');

    vsWindow.showErrorMessage(`Error: ${errMsg}`);
};

export { errorMessage };