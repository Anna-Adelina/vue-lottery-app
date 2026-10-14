export interface PaginationParams {
  limit?: number
  skip?: number
  q?: string
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
}

export interface Readable<T> {
  getAll(params?: PaginationParams): Promise<PaginatedResult<T>>
  getById(id: number): Promise<T>
}

export interface Creatable<T, TCreate> {
  create(data: TCreate): Promise<T>
}

export interface Editable<T, TUpdate> {
  update(id: number, data: TUpdate): Promise<T>
}

export interface Deletable {
  delete(id: number): Promise<void>
}