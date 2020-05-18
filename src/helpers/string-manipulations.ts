import { WorkspaceFolder } from 'vscode';

const removeFirstSlashInString = (s: string = '') => s.replace(/^\/+/g, '');
const removeLastSlashInString = (s: string = '') => s.replace(/\/$/, '');

const removeWorkspaceUrlRootFromUrl = (
  workspaceFolders: WorkspaceFolder[],
  url: string
) => {
  const workspaceUrl = getWorkspaceUrlRootFromUrl(workspaceFolders, url);

  return url.replace(workspaceUrl, '');
};

const getWorkspaceUrlRootFromUrl = (
  workspaceFolders: WorkspaceFolder[],
  url: string
) => {
  const workspacePaths = workspaceFolders.map(w => w.uri.fsPath);
  return workspacePaths.find(workspacePath => url.includes(workspacePath));
};

export {
  removeFirstSlashInString,
  removeLastSlashInString,
  removeWorkspaceUrlRootFromUrl,
  getWorkspaceUrlRootFromUrl,
};
