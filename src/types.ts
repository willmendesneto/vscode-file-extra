import { Stats } from 'fs';
import { Uri, TextEditor, TextDocument, WorkspaceFolder } from 'vscode';
import { ParsedPath } from 'path';

export type FileStats = Stats;
export type FileParsedPath = ParsedPath;

export interface IPluginSettings {
  openFileAfterDuplication: boolean;
  closeFileAfterRemove: boolean;
}

export type ActionParams = {
  uri: Uri;
  settings: IPluginSettings;
  workspaceFolders?: WorkspaceFolder[];
};

export type URITextEditorCommand = TextDocument | Uri;

export type ActionParamsBuilder = {
  uri: URITextEditorCommand;
  settings: IPluginSettings;
  editor: TextEditor | undefined;
  workspaceFolders?: WorkspaceFolder[];
};

export type CopyOptions = {
  removeRoot: boolean;
};
