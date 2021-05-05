import { Store, StoreData, StoreObserver } from "../type";
export declare class Observable {
    observes: StoreObserver<any>[];
    addObserver(observer: StoreObserver<any>): void;
    removeObserver(observer: StoreObserver<any>): void;
    notifyObservers(store: Store<any>, data: StoreData): void;
}
