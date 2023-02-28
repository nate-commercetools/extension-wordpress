import { DataSourceConfiguration, DataSourceContext, DataSourceResult } from '@frontastic/extension-types';
import WordpressApollo from './apis/BaseApi';
import * as ContentActions from './actionControllers/WordpressController';
import { postListQuery, pageQuery } from './graphql';
export default {
  'data-sources': {
    'wordpress/featured-posts': async (
      config: DataSourceConfiguration,
      context: DataSourceContext,
    ): Promise<DataSourceResult> => {
      try {
        const { host } = context?.frontasticContext?.project?.configuration['wordpress'];
        const apollo = new WordpressApollo(`${host}/graphql`);

        // Variables are extracted from Dynamic Filters in studio, if no filters are found then
        // the query will just return the latest posts
        const variables = {
        categoryName: config.configuration.categoryTerm.values['post.attributes.categories'] ? config.configuration.categoryTerm.values['post.attributes.categories'] : '',
        postTags: config.configuration.categoryTerm.values['post.attributes.tags'] ? config.configuration.categoryTerm.values['post.attributes.tags'] : '',
      };

      const { posts } = await apollo.getWordpress({
        query: postListQuery,
        variables
      });

      return {
        dataSourcePayload: { blogPosts: posts },
      } as DataSourceResult;
      } catch (error) {
        return {
            dataSourcePayload: error,
          } as DataSourceResult;
      }
    },
    'wordpress/page-content': async (
        config: DataSourceConfiguration,
        context: DataSourceContext,
      ): Promise<DataSourceResult> => {
        const { host } = context?.frontasticContext?.project?.configuration['wordpress'];
        const handle = config?.configuration?.pageHandle;

        const apollo = new WordpressApollo(`${host}/graphql`);
        const { pageBy } = await apollo.getWordpress({
          query: pageQuery,
          variables: {
            handle,
          },
        });

        return {
          dataSourcePayload: { blogPage: pageBy },
        } as DataSourceResult;
      },
  },
  actions: {
    wordpress: ContentActions,
  },
};
