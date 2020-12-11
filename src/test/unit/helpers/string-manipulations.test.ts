import assert from 'assert';
import { resolve, join } from 'path';

import {
  removeFirstSlashInString,
  removeLastSlashInString,
  removeWorkspaceUrlRootFromUrl,
  getWorkspaceUrlRootFromUrl,
} from '../../../helpers/string-manipulations';

const STRING_TEST = '/Folder/internal/file.js/';

describe('String Manipulation Helper', () => {
  it('should remove first slash in the string', () => {
    assert.equal(
      removeFirstSlashInString(STRING_TEST),
      'Folder/internal/file.js/'
    );
  });

  it('should remove first slash in the string', () => {
    assert.equal(
      removeLastSlashInString(STRING_TEST),
      '/Folder/internal/file.js'
    );
  });

  it('should remove workspace root from file path url', () => {
    const filename = 'file.txt';

    const workspaceRootPath = resolve(join(__dirname, './../fixtures'));
    const workspaceFolders: any[] = [
      {
        index: 0,
        name: 'fixtures',
        uri: { fsPath: workspaceRootPath },
      },
    ];

    assert.equal(
      removeWorkspaceUrlRootFromUrl(
        workspaceFolders,
        `${workspaceRootPath}/${filename}`
      ),
      `/${filename}`
    );
  });

  it('should return active workspace root from file path url', () => {
    const filename = 'file.txt';

    const workspaceRootPath = resolve(join(__dirname, './../fixtures'));
    const anotherWorkspaceRootPath = resolve(join(__dirname, './../unit'));
    const workspaceFolders: any[] = [
      {
        index: 0,
        name: 'fixtures',
        uri: { fsPath: workspaceRootPath },
      },
      {
        index: 0,
        name: 'unit',
        uri: { fsPath: anotherWorkspaceRootPath },
      },
    ];

    assert.equal(
      getWorkspaceUrlRootFromUrl(
        workspaceFolders,
        `${workspaceRootPath}/${filename}`
      ),
      workspaceRootPath
    );
  });
});
