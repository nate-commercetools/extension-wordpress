interface FilterSchema {
    node: {
        value: string;
        name: string;
    }
}

export class WordpressMapper {

    /**
     * wordpressCategoriesToSchema
     *
     * Convert Wordpress formatted Graphql data into commercetools Frontend Studio
     * compatible schema for Dynamic Filters.
     *
     * @static
     * @param {FilterSchema[]} attributes
     * @returns {{ field: string; type: string; label: string; values: any; }}
     */
    static wordpressCategoriesToSchema(attributes: FilterSchema[]) {
        const mappedAttributes =  this.gqlToSchema(attributes);

        if (mappedAttributes && mappedAttributes.length > 0) {
            return {
                field: 'postCategories',
                type: 'enum',
                label: 'Categories',
                values: mappedAttributes
            }
        } else {
            return null
        }
    }

    /**
     * wordpressTagsToSchema
     *
     * Convert Wordpress formatted Graphql data into commercetools Frontend Studio
     * compatible schema for Dynamic Filters.
     *
     * @static
     * @param {FilterSchema[]} attributes
     * @returns {{ field: string; type: string; label: string; values: any; }}
     */
    static wordpressTagsToSchema(attributes: FilterSchema[]) {
        const mappedAttributes =  this.gqlToSchema(attributes);

        if (mappedAttributes && mappedAttributes.length > 0) {
            return {
                field: 'postTags',
                type: 'enum',
                label: 'Tags',
                values: mappedAttributes
            }
        } else {
            return null
        }
    }

    /**
     * gqlToSchema
     *
     * Iterate over GraphQL data and return an array of commercetools Schema
     *
     * @private
     * @static
     * @param {FilterSchema[]} gqlData
     * @returns {{value: string, name: string }[]}
     */
    private static gqlToSchema(gqlData: FilterSchema[]) {
        if(gqlData.length > 0) {
            const attributes = gqlData.map((category: FilterSchema) => (
                {
                    value: category?.node?.value,
                    name: category?.node?.name,
                }
            ));

            return attributes
        } else {
            return undefined
        }
    }
}
