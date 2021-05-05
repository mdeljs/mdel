import {Store, StoreData, StoreObserver} from "../type";

export class Observable {
    observes: StoreObserver<any>[] = [];

    addObserver(observer: StoreObserver<any>) {
        this.removeObserver(observer);
        this.observes.push(observer);
    }

    removeObserver(observer: StoreObserver<any>) {
        this.observes = this.observes.filter(item => item !== observer);
    }

    notifyObservers(store: Store<any>, data: StoreData) {
        const observes = [...this.observes];

        observes.forEach(observer => observer.call(store, data));
    }
}
