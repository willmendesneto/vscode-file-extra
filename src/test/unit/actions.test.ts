import { resolve, join } from 'path';
import * as fs from 'fs-extra';
import * as assert from 'assert';
import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';

const sandbox = sinon.createSandbox();

const workspaceRootPath = resolve(join(__dirname, './../fixtures'));

const filename = 'another-folder/file.js';
const existentFile = 'a.js';
const uri = { fsPath: workspaceRootPath };

describe('Actions', () => {
  let actions;

  const executeCommand = sandbox.stub();
  const showErrorMessage = sandbox.stub();
  const showTextDocument = sandbox.stub();
  const openTextDocument = sandbox.stub();
  const showInputBox = sandbox.stub();
  const showWarningMessage = sandbox.stub();
  const showInformationMessage = sandbox.stub();
  const writeSync = sandbox.stub();
  const errorMessage = sandbox.stub();
  const pathExists = sinon.stub();

  beforeEach(() => {
    actions = proxyquire('../../actions', {
      vscode: {
        window: { showTextDocument, showErrorMessage },
        commands: { executeCommand },
        workspace: { openTextDocument },
      },
      './helpers/prompt': {
        showInputBox,
        showWarningMessage,
        showInformationMessage,
      },
      clipboardy: { writeSync },
      'fs-extra': { pathExists },
      './helpers/error-message': { errorMessage },
    });
  });

  afterEach(async () => {
    sandbox.reset();
    await fs.removeSync(`${workspaceRootPath}/${filename}`);
  });

  after(() => sandbox.restore());

  describe('#add', () => {
    it('should add a new file in the workspace', async () => {
      showInputBox.returns(Promise.resolve(filename));
      openTextDocument.returns(
        Promise.resolve(`${workspaceRootPath}/${filename}`)
      );

      await actions.add({ uri, workspaceRootPath });

      assert.equal(
        executeCommand.firstCall.args[0],
        'workbench.files.action.refreshFilesExplorer'
      );
      assert.equal(
        showTextDocument.firstCall.args[0],
        `${workspaceRootPath}/${filename}`
      );
      assert.equal(errorMessage.callCount, 0);
    });

    it('should not add if new file already exists', async () => {
      showInputBox.returns(Promise.resolve(existentFile));
      showWarningMessage.returns(Promise.resolve(false));
      pathExists.returns(Promise.resolve(true));

      await actions.add({ uri, workspaceRootPath });

      assert.equal(
        showWarningMessage.firstCall.args[0],
        `**${workspaceRootPath}/${existentFile}** alredy exists. Do you want to overwrite?`
      );
      assert.equal(errorMessage.callCount, 0);
    });

    it('should not add if new folder already exists', async () => {
      showInputBox.returns(Promise.resolve('folder'));
      showWarningMessage.returns(Promise.resolve(false));
      pathExists.returns(Promise.resolve(true));

      await actions.add({ uri, workspaceRootPath });

      assert.equal(
        showInformationMessage.firstCall.args[0],
        `**${workspaceRootPath}/folder** alredy exists.`
      );
      assert.equal(errorMessage.callCount, 0);
    });

    it('should not add a new file if user cancel the action', async () => {
      showInputBox.returns(Promise.resolve(undefined));

      await actions.add({ uri, workspaceRootPath });

      assert.equal(showErrorMessage.callCount, 0);
      assert.equal(showInformationMessage.callCount, 0);
      assert.equal(showWarningMessage.callCount, 0);
      assert.equal(errorMessage.callCount, 0);
    });
  });

  describe('remove', () => {
    it('should refresh file explorer after remove file', async () => {
      await actions.remove({
        uri: { fsPath: `${workspaceRootPath}/${filename}` },
        workspaceRootPath,
        settings: {},
      });
      assert.equal(
        executeCommand.firstCall.args[0],
        'workbench.files.action.refreshFilesExplorer'
      );
    });

    it('should refresh file explorer and remove deleted file after remove file if `closeFileAfterRemove` editor settings is true', async () => {
      await actions.remove({
        uri: { fsPath: `${workspaceRootPath}/${filename}` },
        workspaceRootPath,
        settings: { closeFileAfterRemove: true },
      });
      assert.equal(
        executeCommand.firstCall.args[0],
        'workbench.files.action.refreshFilesExplorer'
      );
      assert.equal(
        executeCommand.secondCall.args[0],
        'workbench.action.closeActiveEditor'
      );
    });
  });

  describe('copyFilePath', () => {
    it('should copy full file path in clipboard', async () => {
      await actions.copyFilePath({
        uri: { fsPath: `${workspaceRootPath}/${filename}` },
        workspaceRootPath,
      });
      assert.equal(
        writeSync.firstCall.args[0],
        `${workspaceRootPath}/${filename}`
      );
    });
  });

  describe('copyRelativeFilePath', () => {
    it('should copy relative file path in clipboard', async () => {
      await actions.copyRelativeFilePath({
        uri: { fsPath: `${workspaceRootPath}/${filename}` },
        workspaceRootPath,
      });
      assert.equal(writeSync.firstCall.args[0], filename);
    });
  });
});
