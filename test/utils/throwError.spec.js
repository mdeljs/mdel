import throwError from "../../src/utils/throwError";

describe('utils', function () {
  describe('throwError', () => {
    it('when conditions are true', () => {
      expect(() => throwError(true, 'error')).toThrow('error');
    });

    it('when conditions are false', () => {
      expect(() => throwError(false, 'error')).not.toThrow()
    });
  })
});
