import {Model} from "../../src/apis/model";

describe('model', function () {
  it('test construction', function () {
    expect(() => new Model()).toThrow('initData is not a object');
    expect(new Model({a: 1, b: 1}).data).toEqual({a: 1, b: 1});
    expect(new Model({a: 1, b: 1}).prevData).toEqual({});
  });
  it('test setData', function () {
    const data = {a: 1};
    const store = new Model(data);

    store.setData({});
    expect(store.data === data).toBeFalsy();

    store.setData({a: 2});
    expect(store.data).toEqual({a: 2});
    expect(store.prevData).toEqual({a: 1});

    expect(() => {
      store.setData();
      store.setData(1);
    }).toThrow('data is not a object');
  });
  it('test basic subscribe', function () {
    const store = new Model({});

    expect(() => store.subscribe(1)).toThrow('listener is not a function');

    const unSubscribe = store.subscribe(function () {
    });
    expect(store.pvtListeners.length).toBe(1);

    unSubscribe();
    expect(store.pvtListeners.length).toBe(0);
  });

  it('test listener call', function f() {
    const store = new Model({uid: 0});
    const listener = jest.fn();

    store.subscribe(listener);

    store.setData({uid: 1});

    expect(listener.mock.calls.length).toBe(1);
    expect(store.prevData.uid).toBe(0);
    expect(store.data.uid).toBe(1);
  });
});
