export const environment = {
  production: true,
  apiUrl: 'https://algamoney-api-vitor.herokuapp.com',
  tokenAllowedDomains: [new RegExp('algamoney-api-vitor.herokuapp.com')],
  tokenDisallowedRoutes: [new RegExp('/oauth/token')],
};
