import { request } from 'graphql-request'

export const GRAPHQL_ENDPOINT = 'https://countries.trevorblades.com/graphql'

export function gqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  return request<T>(GRAPHQL_ENDPOINT, query, variables)
}
