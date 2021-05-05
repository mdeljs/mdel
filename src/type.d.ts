export declare type StoreData = object;
export declare type StoreObserver<D extends StoreData> = (previousData: D) => void;
export declare type StoreUnobserve = () => void;
export declare type StoreObserve<D extends StoreData> = (observer: StoreObserver<D>) => StoreUnobserve;
export declare type StoreActions = {
  init?: (...args: any[]) => void;
  input?: (...args: any[]) => void;
  output?: () => any;
} & {
  [index in PropertyKey]: (...args: any[]) => any;
};
export declare type StoreCore<D extends StoreData, BA extends StoreActions> = {
  isStore: boolean;
  setData: (data: Partial<D>) => void;
  convertData: () => ConvertData<D>;
  resetData: () => void;
  observe: StoreObserve<D>;
  baseActions: BA;
};
export declare type Store<D extends StoreData, A extends StoreActions = {}, BA extends StoreActions = {}> = {
  core: StoreCore<D, BA>;
} & {
  actions: A;
} & D;
export declare type Model<D extends StoreData, A extends StoreActions = {}, BA extends StoreActions = {}> = {
  new(): Store<D, A, BA>;
  isModel: boolean;
};
export declare type PickModelStore<M> = M extends new (...args: any[]) => infer P ? P : any;
export declare type PickModelData<M> = M extends Model<infer D, infer A> ? D : {};
export declare type PickModelActions<M> = M extends Model<infer D, infer A> ? A : {};
export declare type PickStoreData<S> = S extends Store<infer D, infer A> ? D : {};
export declare type PickStoreActions<S> = S extends Store<infer D, infer A> ? A : {};
export declare type CreateModelInitiator<D extends StoreData, A extends StoreActions = {}, B extends Model<StoreData> | null = null> = {
  single?: boolean;
  base?: B;
  data: () => D;
  actions?: A & ThisType<Store<D & PickModelData<B>, A & PickModelActions<B>, PickModelActions<B>>>;
};
export declare type CreateModel = <D extends StoreData, A extends StoreActions = {}, B extends Model<StoreData> | null = null>(initiator: CreateModelInitiator<D, A, B>) => Model<D & PickModelData<B>, A & PickModelActions<B>, PickModelActions<B>>;
export declare type ConvertData<D> = ConvertArrayData<ConvertObjectData<ConvertStoreData<D>>>;
declare type ConvertStoreData<S> = S extends Store<infer D> ? ConvertData<D> : S;
declare type ConvertObjectData<O> = O extends object ? {
  [K in keyof O]: ConvertData<O[K]>;
} : O;
declare type ConvertArrayData<A> = A extends Array<infer T> ? ConvertData<T>[] : A;
