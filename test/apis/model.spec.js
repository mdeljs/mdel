import {getIsModel, Model} from "../../src/apis/model";

describe('model', function () {
  it('test construction', function () {
    expect(() => new Model(1)).toThrow('initData is not a object');
    expect(new Model({a: 1, b: 1}).data).toEqual({a: 1, b: 1});
  });
  it('test update', function () {
    const model = new Model({a: 1});

    expect(() => model.update(1)).toThrow('data is not a valid parameter');
    expect(() => model.update(() => {
    })).not.toThrow();
    expect(() => model.update({})).not.toThrow();
    expect(() => model.update(null)).not.toThrow();

    model.update({a: 2});
    expect(model.data).toEqual({a: 2});

    model.update(null);
    expect(model.data).toEqual({a: 2});

    model.update(function () {
      this.data.a = 1;
    });
    expect(model.data).toEqual({a: 1});
  });
  it('test basic subscribe', function () {
    const model = new Model({});

    expect(() => model.subscribe(1)).toThrow('listener is not a function');

    const unSubscribe = model.subscribe(function () {
    });
    expect(model.pvtListeners.length).toBe(1);

    unSubscribe();
    expect(model.pvtListeners.length).toBe(0);
  });

  it('test listener call', function f() {
    const model = new Model({uid: 0});
    const beforeCb = jest.fn();
    const afterCb = jest.fn();

    let beforeUid, afterUid;

    model.subscribe(function (...beforeArgs) {
      beforeCb(...beforeArgs);
      beforeUid = model.data.uid;

      return function (...afterArgs) {
        afterCb(...afterArgs);
        afterUid = model.data.uid;
      };
    });

    model.update({uid: 1});

    expect(beforeCb.mock.calls.length).toBe(1);
    expect(afterCb.mock.calls.length).toBe(1);

    expect(beforeUid).toBe(0);
    expect(afterUid).toBe(1);
  });

  it('test getIsModel', function () {
    expect(getIsModel(null)).toBeFalsy();
    expect(getIsModel({})).toBeFalsy();
    expect(getIsModel(function () {

    })).toBeFalsy();

    expect(getIsModel(new Model({}))).toBeTruthy();
    expect(getIsModel(new class extends Model {
      constructor() {
        super({});
      }
    })).toBeTruthy();
  });
});
