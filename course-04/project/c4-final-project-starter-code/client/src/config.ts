// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '17aijjrcrd'
export const apiEndpoint = `https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-pq916rib.eu.auth0.com',            // Auth0 domain
  clientId: 'kpIPLD6bz3PeFLxExW0a2wA4gxu28ueR',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
