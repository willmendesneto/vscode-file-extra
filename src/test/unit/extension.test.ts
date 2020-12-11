//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import assert from 'assert';

import { activate } from '../../extension';

// TODO: Use `ExtensionContext` type for context
const context: any = {
  subscriptions: [],
};

describe('Extension Tests', () => {
  it('Should have only 7 commands', () => {
    activate(context);

    assert.equal(context.subscriptions.length, 7);
  });
});
