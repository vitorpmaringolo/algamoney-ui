export const environment = {
  production: true,
  apiUrl: 'https://algamoney-api-vitor.herokuapp.com',
  tokenAllowedDomains: [/algamoney-api-vitor.herokuapp.com/],
  tokenDisallowedRoutes: [/\/oauth2\/token/],
  oauthCallbackUrl: 'https://algamoney-api-vitor.herokuapp.com/authorized',
  logoutRedirectToUrl: 'https://algamoney-api-vitor.herokuapp.com',
};
