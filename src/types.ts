import { Stats } from 'fs';
import { Uri, TextEditor, TextDocument } from 'vscode';
import { ParsedPath } from 'path';

export type FileStats = Stats;
export type FileParsedPath = ParsedPath;

export interface IPluginSettings {
  openFileAfterDuplication: boolean;
  closeFileAfterRemove: boolean;
}

export type ActionParams = {
  uri: Uri;
  workspaceRootPath?: string;
  settings: IPluginSettings;
};

export type URITextEditorCommand = TextDocument | Uri;

export type ActionParamsBuilder = {
  uri: URITextEditorCommand;
  workspaceRootPath?: string;
  settings: IPluginSettings;
  editor: TextEditor | undefined;
};
