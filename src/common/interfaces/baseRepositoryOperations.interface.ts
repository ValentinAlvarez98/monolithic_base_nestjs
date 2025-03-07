import { Pagination } from "..";


export interface BaseRepositoryOperationsInterface<T, K, L = string | number> {
      
      countItems(): Promise<number>;
      create(data: K): Promise<T>;
      findById(id: L): Promise<T | null>;
      findAll(pagination: Pagination): Promise<T[]>;
      updateById(id: L, data: Partial<K>): Promise<T | null>;
      deleteById(id: L): Promise<boolean>;

}