import assert from 'assert';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

describe('Error Helper', () => {
  let errorMessage;
  const sandbox = sinon.createSandbox();
  const showErrorMessage = sandbox.stub();

  beforeEach(() => {
    errorMessage = proxyquire('../../../helpers/error-message', {
      vscode: {
        window: { showErrorMessage },
      },
    }).errorMessage;
  });

  afterEach(() => sandbox.reset());

  after(() => sandbox.restore());

  it('should build path to file', () => {
    const error = new Error('Dummy message');
    errorMessage(error);

    assert.equal(showErrorMessage.firstCall.args[0], `Error: ${error.message}`);
  });
});
