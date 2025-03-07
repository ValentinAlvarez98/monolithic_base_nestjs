

export type PaginationResult<T> = {

      data: T;
      meta: {

            totalItems: number;
            itemCount: number;
            itemsPerPage: number;
            currentPage: number;
            totalPages: number;

      }

}