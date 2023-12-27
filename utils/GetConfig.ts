import { StudioConfig } from '../interfaces/StudioConfig';
import { Context } from '@frontastic/extension-types';

export const getWordpressConfig = (context: Context): StudioConfig => {
  if (!context) throw 'Configuration not available';

  return {
    hostUrl: context.projectConfiguration.EXTENSION_WORDPRESS_HOST_URL,
    apiUrl: context.projectConfiguration.EXTENSION_WORDPRESS_API_URL,
    blogRoot: context.projectConfiguration.EXTENSION_WORDPRESS_API_BLOG_ROOT,
    pageRoot: context.projectConfiguration.EXTENSION_WORDPRESS_API_PAGE_ROOT,
    postRoot: context.projectConfiguration.EXTENSION_WORDPRESS_API_POST_ROOT,
  } as StudioConfig;
};
