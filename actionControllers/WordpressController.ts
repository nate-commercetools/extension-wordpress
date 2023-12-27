import { ActionContext, Request, Response } from '@frontastic/extension-types/src/ts/index';
import WordpressApollo from '../apis/BaseApi';
import { postFilters } from '../graphql';
import { WordpressMapper } from '../mappers/WordpressMapper';
import { getWordpressConfig } from '../utils/GetConfig';
import { StudioConfig } from '../interfaces/StudioConfig';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

/**
 * getPostFilters
 *
 * Dynamic Filter Endpoint to query Wordpress and get Filterable Attributes to use when
 * displaying posts on Frontend.
 *
 * @async
 * @param {Request} request
 * @param {ActionContext} actionContext
 * @returns {Promise<Response>}
 */
export const getPostFilters: ActionHook = async (request: Request, actionContext: ActionContext): Promise<Response> => {
  try {
    const blogSettings: StudioConfig = getWordpressConfig(actionContext?.frontasticContext.projectConfiguration);
    const apollo = new WordpressApollo(blogSettings);

    const postFilterData = await apollo.getWordpress({
      query: postFilters,
    });

    // Map the GQL Data to commercetools schema format
    const schemafiedCategories = WordpressMapper.wordpressCategoriesToSchema(postFilterData.categories.edges);
    const schemafiedTags = WordpressMapper.wordpressTagsToSchema(postFilterData.tags.edges);

    // Stringify Data to Return
    const body = JSON.stringify([schemafiedCategories, schemafiedTags]);

    return {
      statusCode: 200,
      body,
      sessionData: request.sessionData,
    } as Response;
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify([error]),
      sessionData: request.sessionData,
    } as Response;
  }
};
