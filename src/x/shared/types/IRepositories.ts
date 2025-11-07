/// Types for pagination
export interface PaginationOptions {
    page?: number;
    limit?: number;
}

export interface PaginationResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

/// Types for filtering
export type FilterOperator =
    | 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte'
    | 'like' | 'ilike' | 'in' | 'notIn'
    | 'isNull' | 'isNotNull';

export interface FilterCondition {
    field: string;
    operator: FilterOperator;
    value?: any;
}

export interface FilterOptions {
    conditions?: FilterCondition[];
    logic?: 'AND' | 'OR';
}

/// Types for sorting
export interface SortOption {
    field: string;
    direction: 'ASC' | 'DESC';
}

/// Types for searching
export interface SearchOptions {
    fields: string[];
    query: string;
    caseSensitive?: boolean;
}

/// Transaction options
export interface TransactionOptions {
    timeout?: number;
    isolationLevel?: 'read uncommitted' | 'read committed' | 'repeatable read' | 'serializable';
}

/// Main query options interface
export interface QueryOptions {
    pagination?: PaginationOptions;
    filters?: FilterOptions;
    search?: SearchOptions;
    sort?: SortOption[];
    select?: string[];
    include?: Record<string, boolean | QueryOptions>;
}

export interface IRepository<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
    getCacheKey(id: string): string;

    create(data: TCreate, options?: { kafka?: boolean }): Promise<T>;
    createMany(data: TCreate[], options?: { kafka?: boolean; batchSize?: number }): Promise<T[]>;

    readOne(id: string | number | FilterOptions, options?: { kafka?: boolean }): Promise<T | null>;
    readList(options?: QueryOptions & { kafka?: boolean }): Promise<T[] | PaginationResult<T> | PaginationResult<T>>;

    update(id: string | number, data: TUpdate, options?: { kafka?: boolean }): Promise<T | null>;
    updateMany(filters: FilterOptions, data: TUpdate, options?: { kafka?: boolean, batchSize?: number }): Promise<T[]>;

    delete(id: string | number, options?: { kafka?: boolean, soft?: boolean }): Promise<boolean>;
    deleteMany(filters: FilterOptions, options?: { kafka?: boolean, soft?: boolean }): Promise<number>;

    count(filters?: FilterOptions): Promise<number>;
    exist(id: string | number | FilterOptions): Promise<boolean>;

    /// Transaction methods
    withTransaction<R>(callback: (repo: IRepository<T, TCreate, TUpdate>) => Promise<R>): Promise<R>;
}
