import { gql } from '@apollo/client';

const postListQuery = gql`
  query PostList($categoryName: String!, $postTags: String!, $limit: Int = 8) {
    posts(first: $limit, where: { categoryName: $categoryName, tag: $postTags }) {
      edges {
        node {
          id
          title
          handle: slug
          summary: excerpt
          image: featuredImage {
            node {
              url: sourceUrl(size: LARGE)
              alt: altText
            }
          }
        }
      }
    }
  }
`;

const pageQuery = gql`
  query PageQuery($handle: String!) {
    pageBy(uri: $handle) {
      id
      title
      date
      content
      image: featuredImage {
        node {
          url: sourceUrl(size: LARGE)
          alt: altText
        }
      }
    }
  }
`;

const postFilters = gql`
  query PostFilters($limit: Int = 50) {
    categories(first: $limit) {
      edges {
        node {
          value: slug
          name: name
        }
      }
    }
    tags(first: $limit) {
      edges {
        node {
          value: slug
          name: name
        }
      }
    }
  }
`;

export { postListQuery, postFilters, postQuery, pageQuery };
