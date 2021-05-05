export type StoreData = object;
export  type StoreObserver<D extends StoreData> = (previousData: D) => void;
export  type StoreUnobserve = () => void;
export  type StoreObserve<D extends StoreData> = (observer: StoreObserver<D>) => StoreUnobserve;
export  type StoreActions = {
  init?: (...args: any[]) => void;
  input?: (...args: any[]) => void;
  output?: () => any;
} & {
  [index in PropertyKey]: (...args: any[]) => any;
};
export  type StoreCore<D extends StoreData, BA extends StoreActions> = {
  isStore: boolean;
  setData: (data: Partial<D>) => void;
  convertData: () => ConvertData<D>;
  resetData: () => void;
  observe: StoreObserve<D>;
  baseActions: BA;
};
export  type Store<D extends StoreData, A extends StoreActions = {}, BA extends StoreActions = {}> = {
  core: StoreCore<D, BA>;
} & {
  actions: A;
} & D;
export  type Model<D extends StoreData, A extends StoreActions = {}, BA extends StoreActions = {}> = {
  new(): Store<D, A, BA>;
  isModel: boolean;
};
export  type PickModelStore<M> = M extends new (...args: any[]) => infer P ? P : any;
export  type PickModelData<M> = M extends Model<infer D, infer A> ? D : {};
export  type PickModelActions<M> = M extends Model<infer D, infer A> ? A : {};
export  type PickStoreData<S> = S extends Store<infer D, infer A> ? D : {};
export  type PickStoreActions<S> = S extends Store<infer D, infer A> ? A : {};
export  type CreateModelInitiator<D extends StoreData, A extends StoreActions = {}, B extends Model<StoreData> | null = null> = {
  single?: boolean;
  base?: B;
  data: () => D;
  actions?: A & ThisType<Store<D & PickModelData<B>, A & PickModelActions<B>, PickModelActions<B>>>;
};
export  type CreateModel = <D extends StoreData, A extends StoreActions = {}, B extends Model<StoreData> | null = null>(initiator: CreateModelInitiator<D, A, B>) => Model<D & PickModelData<B>, A & PickModelActions<B>, PickModelActions<B>>;
export  type ConvertData<D> = ConvertArrayData<ConvertObjectData<ConvertStoreData<D>>>;
type ConvertStoreData<S> = S extends Store<infer D> ? ConvertData<D> : S;
type ConvertObjectData<O> = O extends object ? {
  [K in keyof O]: ConvertData<O[K]>;
} : O;
type ConvertArrayData<A> = A extends Array<infer T> ? ConvertData<T>[] : A;

export const version = '8.0.0';
