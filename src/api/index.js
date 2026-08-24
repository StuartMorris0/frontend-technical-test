import { request } from './helpers';

const VEHICLES_ENDPOINT = '/api/vehicles.json';

/**
 * Fetch every vehicle with its summary and detail merged.
 *
 * Drops any vehicle whose detail call failed or has no price.
 *
 * @return {Promise<Array.<vehicleSummaryPayload>>}
 */
export default async function getData() {
  const summaries = await request(VEHICLES_ENDPOINT);

  const detailResults = await Promise.allSettled(
    summaries.map((summary) => request(summary.apiUrl)),
  );

  return summaries
    .map((summary, index) => {
      const result = detailResults[index];
      if (result.status !== 'fulfilled' || !result.value.price) return null;
      return { ...summary, ...result.value };
    })
    .filter(Boolean);
}
