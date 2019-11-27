import throwError from "../../src/utils/throwError";

describe('utils', function () {
  describe('throwError', () => {
    it('test throwError', () => {
      expect(() => throwError('error')).toThrow('error');
    });
  })
});
