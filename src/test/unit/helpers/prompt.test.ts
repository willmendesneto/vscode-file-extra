import assert from 'assert';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

const WORKSPACE_DIR = '/Workspace/example';

describe('Prompt Helper', () => {
  let prompt;

  const FILENAME = 'folder/test/file.ts';

  const sandbox = sinon.createSandbox();
  const showInformationMessage = sandbox.stub();
  const showInputBox = sandbox.stub();
  const showWarningMessage = sandbox.stub();

  beforeEach(() => {
    prompt = proxyquire('../../../helpers/prompt', {
      vscode: {
        window: { showWarningMessage, showInformationMessage, showInputBox },
      },
    });
  });

  afterEach(() => sandbox.reset());

  after(() => sandbox.restore());

  describe('#showWarningMessage', () => {
    it('should render a warning message with the given message and using the given options', async () => {
      const message = 'message';
      const opts = { modal: true };
      await prompt.showWarningMessage(message, opts);
      assert.deepEqual(showWarningMessage.firstCall.args[0], message);

      assert.deepEqual(showWarningMessage.firstCall.args[1], {
        title: 'OK',
        isCloseAffordance: false,
        ...opts,
      });
    });
  });

  describe('#showInformationMessage', () => {
    it('should render an information modal with the given message', async () => {
      const message = 'message';
      await prompt.showInformationMessage(message);

      assert.deepEqual(showInformationMessage.firstCall.args[0], message);
    });
  });

  describe('#showInputBox', () => {
    it('should render an input box with the using the given default text and placeholder', async () => {
      const placeHolder = 'Placeholder';
      const value = 'folder/test/file.ts';
      await prompt.showInputBox(placeHolder, value);

      assert.deepEqual(showInputBox.firstCall.args[0], {
        placeHolder,
        value,
      });
    });
  });
});
