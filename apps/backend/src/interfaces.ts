// Interface to handle with response
export interface ResponseRequestProp {
    // Status response
    status?: number;
    // Headers response
    headers?: object;
    // Response result to the user
    body: object;
  }

export interface PayloadLoginProps {
    // User id
    data: {
      user: string;
    };
    iat: number;
    // Expiration date
    exp: number;
}

type Repository<T> = T;

export type RepositoryList<T> = {
    result: Repository<T>;
    total: number;
    currentPage: number;
    pages: number;
};
