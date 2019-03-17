import * as assert from 'assert';
import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';

const WORKSPACE_DIR = '/Workspace/example';
const FILENAME = 'folder/test/file.ts';

describe('Files Helper', () => {
  let files;

  const sandbox = sinon.createSandbox();
  const showTextDocument = sandbox.stub();
  const executeCommand = sandbox.stub();
  const openTextDocument = sandbox.stub();

  beforeEach(() => {
    openTextDocument.returns(Promise.resolve(FILENAME));
    executeCommand.returns(Promise.resolve(true));
    files = proxyquire('../../../helpers/files', {
      vscode: {
        window: { showTextDocument },
        commands: { executeCommand },
        workspace: { openTextDocument },
      },
    });
  });

  afterEach(() => sandbox.reset());

  after(() => sandbox.restore());

  describe('#buildFilepath', () => {
    it('should build file path based on workspace root and file location', () => {
      assert.equal(
        files.buildFilepath('folder/test/file.ts', WORKSPACE_DIR),
        '/Workspace/example/folder/test/file.ts'
      );
    });
  });

  describe('#openFile', () => {
    it('should force refresh for file explorer', async () => {
      await files.openFile(FILENAME);

      assert.equal(
        executeCommand.firstCall.args[0],
        'workbench.files.action.refreshFilesExplorer'
      );
    });

    it('should show the received file in the editor', async () => {
      await files.openFile(FILENAME);

      assert.equal(showTextDocument.firstCall.args[0], FILENAME);
    });
  });
});
