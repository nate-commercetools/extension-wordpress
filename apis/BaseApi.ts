import { ApolloClient, InMemoryCache, createHttpLink, DocumentNode } from '@apollo/client';
import fetch from 'cross-fetch';

interface GraphqlQuery {
  query: DocumentNode;
  variables?: Record<string, any>;
}

export default class WordpressApollo {
  private client: ApolloClient<unknown>;

  constructor(host: string) {
    const link = createHttpLink({
      uri: host,
      fetch, // Required for enabling Node to use fetch
    });

    this.client = new ApolloClient({
      ssrMode: true, // Required for using Apollo without the browser
      link,
      cache: new InMemoryCache(),
      // Expand confif as needed
    });
  }

  /**
   * getWordpress
   *
   * Function to fetch data from Wordpress with Apollo. Accepts standard GraphQL queries
   * with or without variables.
   *
   * @async
   * @param {GraphqlQuery} { query, variables }
   * @returns {unknown}
   */
  async getWordpress({ query, variables }: GraphqlQuery) {
    try {
      const { data } = await this.client.query({ query, variables });
      if (data.errors) {
        throw new Error(JSON.stringify(data.errors));
      }

      return data;
    } catch (error) {
      return error;
    }
  }
}
