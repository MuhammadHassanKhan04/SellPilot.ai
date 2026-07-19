import axios, { AxiosError } from 'axios';

const LWA_TOKEN_URL = 'https://api.amazon.com/auth/o2/token';
const SP_API_BASE = 'https://sellingpartnerapi-na.amazon.com';

// Per-credentials token cache
const tokenCache = new Map<string, { token: string; expiresAt: number }>();

export interface AmazonCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

/**
 * Parse Amazon credentials stored in the Integration DB.
 * Stored as JSON: { clientId, clientSecret, refreshToken }
 */
export function parseAmazonCredentials(raw: string): AmazonCredentials {
  try {
    return JSON.parse(raw) as AmazonCredentials;
  } catch {
    throw new Error('Invalid Amazon credentials format. Please reconnect your Amazon account in Integrations.');
  }
}

/**
 * Exchange a refresh token for a fresh LWA access token.
 */
export async function getAmazonAccessToken(creds: AmazonCredentials): Promise<string> {
  const cacheKey = creds.clientId;
  const cached = tokenCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt - 60000) {
    return cached.token;
  }

  try {
    const response = await axios.post(
      LWA_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: creds.refreshToken,
        client_id: creds.clientId,
        client_secret: creds.clientSecret,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    const token = response.data.access_token as string;
    const expiresIn = (response.data.expires_in as number) * 1000;
    tokenCache.set(cacheKey, { token, expiresAt: Date.now() + expiresIn });
    return token;
  } catch (err) {
    const axiosErr = err as AxiosError<{ error_description?: string }>;
    const msg = axiosErr.response?.data?.error_description || axiosErr.message;
    throw new Error(`Amazon LWA token exchange failed: ${msg}`);
  }
}

/**
 * Make an authenticated SP-API request using stored credentials.
 */
export async function amazonRequest(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  path: string,
  creds: AmazonCredentials,
  data?: object
) {
  const accessToken = await getAmazonAccessToken(creds);
  try {
    const response = await axios({
      method,
      url: `${SP_API_BASE}${path}`,
      headers: {
        'x-amz-access-token': accessToken,
        'Content-Type': 'application/json',
      },
      data,
    });
    return response.data;
  } catch (err) {
    const axiosErr = err as AxiosError<{ errors?: Array<{ message: string }> }>;
    const spMsg = axiosErr.response?.data?.errors?.[0]?.message;
    throw new Error(spMsg || axiosErr.message);
  }
}

/**
 * Publish a product listing to Amazon via SP-API Listings Items API.
 */
export async function publishToAmazon(
  creds: AmazonCredentials,
  sellerId: string,
  product: {
    title: string;
    description: string;
    price: number;
    quantity: number;
    tags: string[];
  }
) {
  if (!creds.clientId || !creds.clientSecret || !creds.refreshToken) {
    throw new Error('Amazon credentials are incomplete. Please reconnect in Integrations.');
  }
  if (!sellerId) {
    throw new Error('Amazon Seller ID is required. Please add it in Integrations.');
  }

  const sku = `SELLPILLOT-${Date.now()}`;
  const result = await amazonRequest(
    'put',
    `/listings/2021-08-01/items/${sellerId}/${sku}`,
    creds,
    {
      productType: 'PRODUCT',
      requirements: 'LISTING',
      attributes: {
        item_name: [{ value: product.title, marketplace_id: 'ATVPDKIKX0DER' }],
        product_description: [{ value: product.description, marketplace_id: 'ATVPDKIKX0DER' }],
        bullet_point: product.tags.slice(0, 5).map((t) => ({
          value: t,
          marketplace_id: 'ATVPDKIKX0DER',
        })),
        list_price: [{ value: product.price, currency: 'USD', marketplace_id: 'ATVPDKIKX0DER' }],
        fulfillment_availability: [{ fulfillment_channel_code: 'DEFAULT', quantity: product.quantity }],
      },
    }
  );
  return { sku, result };
}

/**
 * Verify Amazon credentials by fetching a fresh access token.
 * Throws a meaningful error if credentials are wrong.
 */
export async function verifyAmazonCredentials(creds: AmazonCredentials): Promise<void> {
  await getAmazonAccessToken(creds); // will throw if creds are bad
}
