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
import { duplicate, remove, renameFile, add } from './actions';
import { removeLastSlashInString } from './helpers/string-manipulations';

const getActionParams = ({
  settings,
  workspaceRootPath = '',
  uri,
  editor,
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
    workspaceRootPath: removeLastSlashInString(workspaceRootPath),
    uri: URI,
  };
};

const startCommand = (uri: URITextEditorCommand, callback: Function) => {
  const params: ActionParams | undefined = getActionParams({
    uri,
    workspaceRootPath: workspace.rootPath,
    settings: workspace.getConfiguration().get('fileExtra') as IPluginSettings,
    editor: vsWindow.activeTextEditor,
  });

  if (!params) {
    return;
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

  context.subscriptions.push(duplicateFileOrFolder);
  context.subscriptions.push(removeFileOrFolder);
  context.subscriptions.push(renameFileOrFolder);
  context.subscriptions.push(addFileOrFolder);
};

export { activate };
