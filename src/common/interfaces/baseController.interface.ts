

export interface BaseControllerInterface<T, K, L = string | number> {

      findById(id: L): Promise<T>;

      findAll(paginationDto: any): Promise<any>;

      delete(id: L): Promise<boolean>;

}