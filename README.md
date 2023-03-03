# Composable Frontend Wordpress Extension
This extension for Composable Frontend is designed to connect Wordpress to Frontend in order to source various content for displaying to customers.

## Prerequisites
---
1. An up-to-date Composable Frontend instance with access to Studio and the GitHub repository where the code is stored
2. A publicly available Wordpress site with [WPGraphQL](https://wordpress.org/plugins/wp-graphql/) installed

## Install Dependencies & Schemas
1. Install the extension dependencies for API Hub:
   ```bash
   # From the root directory of Frontend
   cd packages/<projectid>/backend/
   yarn add  @apollo/client react cross-fetch graphql
   ```
2. [Upload](https://docs.commercetools.com/frontend-studio/using-the-schema-editor#data-sources-schema) the datasource schemas from `schemas/datasource` to Studio
3. Add the Wordpress URL to the relevant environment variables for API Hub and Next JS. To do this, add the configuration object in `project.yml` so the URL will be available to API Hub. This should be located in a root folder with the following naming convention: `<customer>_<project>/config/project.yml`. Config is formatted as follows:
    ```yaml
    configuration:
      wordpress:
        host: https://WORDPRESS_URL.com
    # Rest of Configuration
    ```
    To expose the Wordpress URL to Next JS which enables displaying images, use Environment Variables. For local development this means adding or editing the `.env` in `<customer>/packages/<projectid>/frontend`, and for staging or production you'll add the Environment Variable to Netlify.
    ```bash
    NEXT_PUBLIC_WORDPRESS_HOST=https://WORDPRESS_URL.com
    # Rest of Configuration
    ```
4.  Import and register the Datasource extension within the `<customer>/packages/<projectid>/backend/index.ts` file. There should be an array called `extensionsToMerge` where he Datasource can be added. _This step is very important because if the Datasource extension is not registered to API Hub then Studio & Frontend will not pick up the data._

At this point, the backend of your project should be connected to Wordpress. You'll need to deploy the changes to production so that all functionality will be available in API Hub. Keep in mind that even though you deploy the changes to production they will not impact any existing pages/components/etc until they have been configured to use the datasource. After the deployment has completed, you should be able to visit the Studio and test the new datasource connection. Next steps are to [create a component that consumes the data](https://docs.commercetools.com/frontend-development/developing-a-data-source-extension#4-create-a-component-that-consumes-the-data-source) on the Frontend.
