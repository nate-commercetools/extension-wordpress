import {
  DataSourceConfiguration,
  DataSourceContext,
  DataSourceResult,
  DynamicPageSuccessResult,
  DynamicPageContext,
  Request,
  DynamicPageRedirectResult
} from '@frontastic/extension-types';
import { BlogConfiguration } from './interfaces/WordpressInterfaces'
import WordpressApollo from './apis/BaseApi';
import * as ContentActions from './actionControllers/WordpressController';
import { postListQuery, pageQuery, postQuery } from './graphql';
import { sanitizeURL } from './utils/api-helpers'

export default {
  'dynamic-page-handler': async (
    request: Request,
    context: DynamicPageContext,
  ): Promise<DynamicPageSuccessResult | DynamicPageRedirectResult | null> => {
    // Blog Vars
    const blogRoot = context?.frontasticContext?.projectConfiguration.wordpressBlogRoot || 'blog';
    const blogPageRoot = context?.frontasticContext?.projectConfiguration.wordpressPageRoot || 'pages';
    const blogPostRoot = context?.frontasticContext?.projectConfiguration.wordpressPostRoot || 'posts';

    // Extract blog data from request path
    const blogPageMatch = request?.query?.path?.match(new RegExp(`/${blogRoot}/([^ /]+)/([^ /]+)`));
    const handle = blogPageMatch[2];

    if (blogPageMatch && handle) {
      try {
        const host = context?.frontasticContext?.projectConfiguration?.wordpressHost;
        const apollo = new WordpressApollo(`https://${sanitizeURL(host)}/graphql`);

        // Check what resource type should be called
        switch (blogPageMatch[1]) {
          case blogPageRoot:
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
            } else  {
                // No Blog resource found, send to 404 or anywhere else you prefer
                return {
                    redirectLocation: '/404',
                } as DynamicPageRedirectResult;
            }

          case blogPostRoot:
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
            } else  {
                // No Blog resource found, send to 404 or anywhere else you prefer
                return {
                    redirectLocation: '/404',
                } as DynamicPageRedirectResult;
            }

          default:
            // If the route doesn't match up send to 404 or anywhere else you prefer
            return {
                redirectLocation: '/404',
            } as DynamicPageRedirectResult;
        }
      } catch (error) {
        // Error, send to error page
        return {
            redirectLocation: '/404',
        } as DynamicPageRedirectResult;
      }
    } else {
        // If the route doesn't match up send to 404 or anywhere else you prefer
        return {
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
        const host = context?.frontasticContext?.projectConfiguration?.wordpressHost;
        const apollo = new WordpressApollo(`https://${sanitizeURL(host)}/graphql`);
        // Blog Vars
        const blogConfiguration: BlogConfiguration = {
            blogRoot: context?.frontasticContext?.projectConfiguration.wordpressBlogRoot || 'blog',
            blogPostRoot: context?.frontasticContext?.projectConfiguration.wordpressPostRoot || 'posts',
        }


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
          dataSourcePayload: { blogPosts: posts, blogConfiguration },
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
        const host = context?.frontasticContext?.projectConfiguration?.wordpressHost;
        const handle = config?.configuration?.pageHandle;

        if (handle) {
            const apollo = new WordpressApollo(`https://${sanitizeURL(host)}/graphql`);
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
            return null
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
        const host = context?.frontasticContext?.projectConfiguration?.wordpressHost;
        const handle = config?.configuration?.postHandle;

        const apollo = new WordpressApollo(`https://${sanitizeURL(host)}/graphql`);
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
