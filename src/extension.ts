import {
  Uri,
  workspace,
  window as vsWindow,
  commands,
  ExtensionContext,
} from 'vscode';

import {
  IPluginSettings,
  ActionParams,
  URITextEditorCommand,
  ActionParamsBuilder,
} from './types';
import {
  duplicate,
  remove,
  renameFile,
  add,
  copyFilePath,
  copyRelativeFilePath,
  copyFileName as copyFileNameOnly,
} from './actions';
import { showInformationMessage } from './helpers/prompt';

const getActionParams = ({
  settings,
  uri,
  editor,
  workspaceFolders = [],
}: ActionParamsBuilder): ActionParams | undefined => {
  let URI: Uri = <Uri>uri;
  if (!URI || !(URI as Uri).fsPath) {
    if (!editor) {
      return;
    }
    URI = <Uri>editor.document.uri;
  }

  return {
    settings,
    workspaceFolders,
    uri: URI,
  };
};

const startCommand = (uri: URITextEditorCommand, callback: Function) => {
  const params: ActionParams | undefined = getActionParams({
    uri,
    workspaceFolders: workspace.workspaceFolders,
    settings: workspace.getConfiguration().get('fileExtra') as IPluginSettings,
    editor: vsWindow.activeTextEditor,
  });

  if (!params) {
    return showInformationMessage(
      `Please make sure your editor is focused before run this command.`
    );
  }
  return callback(params);
};

const activate = (context: ExtensionContext): void => {
  const duplicateFileOrFolder = commands.registerCommand(
    'fileExtraDuplicate.execute',
    (uri: URITextEditorCommand) => startCommand(uri, duplicate)
  );

  const removeFileOrFolder = commands.registerCommand(
    'fileExtraRemove.execute',
    (uri: URITextEditorCommand) => startCommand(uri, remove)
  );

  const renameFileOrFolder = commands.registerCommand(
    'fileExtraRename.execute',
    (uri: URITextEditorCommand) => startCommand(uri, renameFile)
  );

  const addFileOrFolder = commands.registerCommand(
    'fileExtraAdd.execute',
    (uri: URITextEditorCommand) => startCommand(uri, add)
  );

  const copyFileUrl = commands.registerCommand(
    'fileExtraCopyFilePath.execute',
    (uri: URITextEditorCommand) => startCommand(uri, copyFilePath)
  );

  const copyRelativeFileUrl = commands.registerCommand(
    'fileExtraCopyRelativeFilePath.execute',
    (uri: URITextEditorCommand) => startCommand(uri, copyRelativeFilePath)
  );

  const copyFileName = commands.registerCommand(
    'fileExtraCopyFileName.execute',
    (uri: URITextEditorCommand) => startCommand(uri, copyFileNameOnly)
  );

  context.subscriptions.push(duplicateFileOrFolder);
  context.subscriptions.push(removeFileOrFolder);
  context.subscriptions.push(renameFileOrFolder);
  context.subscriptions.push(addFileOrFolder);
  context.subscriptions.push(copyFileUrl);
  context.subscriptions.push(copyFileName);
  context.subscriptions.push(copyRelativeFileUrl);
};

export { activate };
