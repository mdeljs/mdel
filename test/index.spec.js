import {version} from "../src";

describe('version', function () {
  it('test version', () => {
    expect(typeof version).toBe('string');
  });
});
