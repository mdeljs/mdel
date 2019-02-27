import isObject from '../../src/utils/isObject'

function Fun() {

}

describe('utils', function () {
  describe('isObject', function () {
    it('should be true', function () {
      expect(isObject({})).toBeTruthy();
      expect(isObject(Object.create({}))).toBeTruthy();
      expect(isObject(new Fun())).toBeTruthy();
    });

    it('should be false', function () {
      expect(isObject(undefined)).toBeFalsy();
      expect(isObject(null)).toBeFalsy();
      expect(isObject(0)).toBeFalsy();
      expect(isObject('string')).toBeFalsy();
      expect(isObject(false)).toBeFalsy();
      expect(isObject(Fun)).toBeFalsy();
      expect(isObject([])).toBeFalsy();
      expect(isObject(/fun/)).toBeFalsy();
    });
  });
});
