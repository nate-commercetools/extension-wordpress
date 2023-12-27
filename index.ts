import {
  DataSourceConfiguration,
  DataSourceContext,
  DataSourceResult,
  DynamicPageSuccessResult,
  DynamicPageContext,
  Request,
  DynamicPageRedirectResult,
  Context
} from '@frontastic/extension-types';
import WordpressApollo from './apis/BaseApi';
import * as ContentActions from './actionControllers/WordpressController';
import { postListQuery, pageQuery, postQuery } from './graphql';
import { StudioConfig } from './interfaces/StudioConfig';
import { getWordpressConfig } from './utils/GetConfig';
import { getPath } from './utils/Request'

export default {
  'dynamic-page-handler': async (
    request: Request,
    context: DynamicPageContext,
  ): Promise<DynamicPageSuccessResult | DynamicPageRedirectResult | null > => {
    const blogSettings: StudioConfig = getWordpressConfig(context?.frontasticContext as Context);

    // Extract blog data from request path
    const currentPath = getPath(request);
    const blogPageMatch = currentPath.match(new RegExp(`/${blogSettings.blogRoot}/([^ /]+)/([^ /]+)`));
    const handle = blogPageMatch[2];

    if (blogPageMatch && handle) {
      try {
        const apollo = new WordpressApollo(blogSettings);

        // Check what resource type should be called
        switch (blogPageMatch[1]) {
          case blogSettings.pageRoot:
            const { pageBy } = await apollo.getWordpress({
              query: pageQuery,
              variables: {
                handle,
              },
            });

            if (pageBy) {
              return {
                dynamicPageType: 'wordpress/blog-page',
                dataSourcePayload: { blogPage: pageBy },
                pageMatchingPayload: { blogPage: pageBy },
              } as DynamicPageSuccessResult;
            } else {
              // No Blog resource found
              throw ("No Wordpress data found.");
            }

          case blogSettings.postRoot:
            const { post } = await apollo.getWordpress({
              query: postQuery,
              variables: {
                handle,
              },
            });

            if (post) {
              return {
                dynamicPageType: 'wordpress/blog-post',
                dataSourcePayload: { post },
                pageMatchingPayload: { post },
              } as DynamicPageSuccessResult;
            } else {
              // No Blog resource found
              throw ("No Wordpress data found.");
            }

          default:
            // No Blog resource found
            throw ("No Wordpress data found.");
        }
      } catch (error) {
        // Handle the error
        console.log('The Wordpress dynamic page handler threw an error.', error);
        return null;
      }
    } else {
      // If the route doesn't match up send to 404 or anywhere else you prefer
      return {
        statusCode: 404,
        redirectLocation: '/404',
      } as DynamicPageRedirectResult;
    }
  },
  'data-sources': {
    'wordpress/featured-posts': async (
      config: DataSourceConfiguration,
      context: DataSourceContext,
    ): Promise<DataSourceResult> => {
      try {
        const blogSettings: StudioConfig = getWordpressConfig(context?.frontasticContext as Context);
        const apollo = new WordpressApollo(blogSettings);

        // Variables are extracted from Dynamic Filters in studio, if no filters are found then
        // the query will just return the latest posts
        const variables = {
          categoryName: config.configuration.postFilters.values['post.attributes.categories']
            ? config.configuration.postFilters.values['post.attributes.categories']
            : '',
          postTags: config.configuration.postFilters.values['post.attributes.tags']
            ? config.configuration.postFilters.values['post.attributes.tags']
            : '',
        };

        const { posts } = await apollo.getWordpress({
          query: postListQuery,
          variables,
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
      try {
        const blogSettings: StudioConfig = getWordpressConfig(context?.frontasticContext as Context);
        const handle = config?.configuration?.pageHandle;

        if (handle) {
          const apollo = new WordpressApollo(blogSettings);

          const { pageBy } = await apollo.getWordpress({
            query: pageQuery,
            variables: {
              handle,
            },
          });

          return {
            dataSourcePayload: { blogPage: pageBy },
          } as DataSourceResult;
        } else {
          return {
            dataSourcePayload: null
          } as DataSourceResult;
        }
      } catch (error) {
        return {
          dataSourcePayload: error,
        } as DataSourceResult;
      }
    },
    'wordpress/post-content': async (
      config: DataSourceConfiguration,
      context: DataSourceContext,
    ): Promise<DataSourceResult> => {
      try {
        const blogSettings: StudioConfig = getWordpressConfig(context?.frontasticContext as Context);
        const handle = config?.configuration?.postHandle;

        const apollo = new WordpressApollo(blogSettings);

        const { post } = await apollo.getWordpress({
          query: postQuery,
          variables: {
            handle,
          },
        });

        return {
          dataSourcePayload: { post },
        } as DataSourceResult;
      } catch (error) {
        return {
          dataSourcePayload: error,
        } as DataSourceResult;
      }
    },
  },
  actions: {
    wordpress: ContentActions,
  },
};
