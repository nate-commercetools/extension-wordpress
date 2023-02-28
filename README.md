# commercetools Frontend Wordpress Extension
This extension for commercetools Frontend is designed to connect Wordpress to Frontend in order to source various content for displaying to customers.

## Prerequisites
---
1. An up-to-date commercetools Frontend instance with access to Studio
2. A publicly available Wordpress site with [WPGraphQL](https://wordpress.org/plugins/wp-graphql/) installed

## Install Dependencies & Schemas
1. Install the extension dependencies for backend:
   ```bash
   # From the root directory of Frontend
   cd <customer>packages/<projectid>/backend/
   yarn add  @apollo/client react cross-fetch graphql
   ```
2. [Upload](https://docs.commercetools.com/frontend-studio/using-the-schema-editor#data-sources-schema) the datasource schemas from `schemas/datasource` to Studio
3. Add Wordpress to the configuration object in `project.yml` for your Frontend project. This should be located in a root folder with the following naming convention: `<customer>_<project>/config/project.yml`. Config is formatted as follows:
    ```yaml
    ...
    configuration:
      wordpress:
        host: https://WORDPRESS_URL.com
    ...
    ```

At this point, the backend of your project should be connected to Wordpress. You'll need to deploy the changes to production so that all functionality will be available in API Hub. Keep in mind that even though you deploy the changes to production they will not impact any existing pages/components/etc until they have been configured to use the datasource. After the deployment has completed, you should be able to visit the Studio and test the new datasource connection.
