import axios from 'axios';

const ETSY_BASE_URL = 'https://api.etsy.com/v3/application';

/**
 * Makes an authenticated Etsy API request.
 * @param keystring  - The Etsy API keystring (x-api-key header)
 * @param oauthToken - The OAuth 2.0 access token (Bearer token)
 */
export async function etsyRequest(
  method: 'get' | 'post' | 'patch' | 'delete',
  path: string,
  keystring: string,
  oauthToken: string,
  data?: object
) {
  const response = await axios({
    method,
    url: `${ETSY_BASE_URL}${path}`,
    headers: {
      'x-api-key': keystring,
      Authorization: `Bearer ${oauthToken}`,
      'Content-Type': 'application/json',
    },
    data,
  });
  return response.data;
}

/**
 * Publish a product as a draft listing to an Etsy shop.
 * @param keystring  - Etsy API Keystring (from developer app)
 * @param oauthToken - Etsy OAuth Access Token (from OAuth flow)
 * @param shopId     - The numeric Etsy Shop ID
 */
export async function publishToEtsy(
  keystring: string,
  oauthToken: string,
  shopId: string,
  product: {
    title: string;
    description: string;
    price: number;
    quantity: number;
    tags: string[];
  }
) {
  if (!keystring || !oauthToken || !shopId) {
    throw new Error('Etsy API Key, OAuth Token, and Shop ID are all required.');
  }

  const listing = await etsyRequest(
    'post',
    `/shops/${shopId}/listings`,
    keystring,
    oauthToken,
    {
      quantity: product.quantity,
      title: product.title,
      description: product.description,
      price: product.price,
      who_made: 'i_did',
      when_made: 'made_to_order',
      taxonomy_id: 1,
      tags: product.tags.slice(0, 13),
      state: 'draft',
    }
  );
  return listing;
}

/**
 * Verify that provided Etsy credentials work by calling the shop endpoint.
 * Returns shop info on success, throws on failure.
 */
export async function verifyEtsyCredentials(keystring: string, oauthToken: string, shopId: string) {
  return etsyRequest('get', `/shops/${shopId}`, keystring, oauthToken);
}
