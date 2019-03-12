import { setPaths, ApiEnpoint, resolvePath } from '../../api/main';
import { assert } from 'chai';

describe('setPaths', () => {
  const api = {
    parentA: {
      childP: new ApiEnpoint(),
      parentB: {
        childQ: new ApiEnpoint(),
        childR: new ApiEnpoint()
      }
    },
    parentC: {
      childX: new ApiEnpoint()
    }
  }

  it('does not modify the original object', () => {
    setPaths(api);
    assert.deepEqual(api.parentA.childP.path, []);
    assert.deepEqual(api.parentA.parentB.childQ.path, []);
    assert.deepEqual(api.parentA.parentB.childR.path, []);
    assert.deepEqual(api.parentC.childX.path, []);
  });

  it('sets the paths correctly', () => {
    const result = setPaths(api);
    assert.deepEqual(result.parentA.childP.path, ['parentA', 'childP']);
    assert.deepEqual(result.parentA.parentB.childQ.path, ['parentA', 'parentB', 'childQ']);
    assert.deepEqual(result.parentA.parentB.childR.path, ['parentA', 'parentB', 'childR']);
    assert.deepEqual(result.parentC.childX.path, ['parentC', 'childX']);
  });

  describe('resolvePath', () => {
    it('returns an empty array given root path', () => {
      const initialized = setPaths(api);
      const result = resolvePath(initialized);
      assert.deepEqual(result, []);
    });

    it('returns the correct path given object in the middle', () => {
      const initialized = setPaths(api);
      const result = resolvePath(initialized.parentA.parentB);
      assert.deepEqual(result, ['parentA', 'parentB']);
    });

    it('returns the correct path given reference to the endpoint', () => {
      const initialized = setPaths(api);
      const result = resolvePath(initialized.parentA.parentB.childQ);
      assert.deepEqual(result, ['parentA', 'parentB', 'childQ']);
    });

    it('throws an error given object which does not belong to the tree', () => {
      const x = { a: 1 };
      assert.throws(() => resolvePath(x));
    });
  })
});
