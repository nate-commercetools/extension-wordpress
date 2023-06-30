export const sanitizeURL = (url: string) => {
  // Remove trailing slashes
  while (url.endsWith('/')) {
    url = url.slice(0, -1);
  }

  // Remove leading 'https://' or 'http://'
  url = url.replace(/^https?:\/\//, '');

  return url;
}
