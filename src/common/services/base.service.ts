import { BaseRepositoryOperationsInterface, Pagination, PaginationResult, BaseServicesValidations } from "../";


export abstract class BaseService<
      RepositoryOperations extends BaseRepositoryOperationsInterface<T, K, L>,
      Validations extends BaseServicesValidations,
      T,
      K,
      L = string | number
      > {

      constructor(
            protected readonly repository: RepositoryOperations,
            protected entityName: string,
            protected readonly validations: Validations
      ) {
            this.validations = validations
      }
      
      // Getters
      get entity(): string {
            return this.entityName;
      }

      // Setters
      set entity(entity: string) {
            this.entityName = entity;
      }

      private async _paginate(pagination: Pagination) {

            const { page, limit } = pagination;

            const totalItems = await this.repository.countItems();

            const lastPage = Math.ceil(totalItems / limit);

            const pageToCheck = {
                  page: page,
                  lastPage: lastPage
            }

            this.validations.setData(pageToCheck);
            this.validations.setMethod(this._paginate.name);
            this.validations.pageOutOfRange();

            const meta = {

                  totalItems,
                  itemCount: totalItems,
                  itemsPerPage: limit,
                  totalPages: lastPage,
                  currentPage: page

            }

            return {
                  pagination,
                  meta: meta
            }


      }
      
      async create(data: K): Promise<T> {

            return await this.repository.create(data);

      }

      async findById(id: L): Promise<T> {

            const data = await this.repository.findById(id);

            this.validations.setData(data);
            this.validations.setMethod(this.findById.name);
            this.validations.notFoundData();

            return data!;

      }

      async findAll(pagination: Pagination): Promise<PaginationResult<T[]>> {

            const { pagination: paginationOptions, meta } = await this._paginate(pagination);

            const data = await this.repository.findAll(paginationOptions);

            const response: PaginationResult<typeof data> = {
                  data,
                  meta
            }

            return response;

      }

      async updateById(id: L, data: Partial<K>): Promise<T> {

            const result = await this.repository.updateById(id, data);

            this.validations.setData(result);
            this.validations.setMethod(this.updateById.name);
            this.validations.notFoundData();

            return result!;

      }

      async deleteById(id: L): Promise<boolean> {

            const result = await this.repository.deleteById(id);

            this.validations.setData(result);
            this.validations.setMethod(this.deleteById.name);
            this.validations.notFoundData();

            return result;

      }

}