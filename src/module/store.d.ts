import { PickModelData, Store, StoreCore, StoreData } from "../type";
import { Observable } from "../utils/observe";
export declare function checkData(data: any): void;
export declare function getStoreData<D extends StoreData, S extends Store<D>>(store: S): PickModelData<D>;
export declare class BaseStore implements Store<{}> {
    core: {
        __observable: Observable;
    } & StoreCore<any, any>;
    actions: {};
}
