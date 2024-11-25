'use server';

import { fetchWikipediaData } from '@/lib/scrapeWikiData';
import { Pioneer, WikipediaInfo } from '@/lib/type';
import { getRedisInstance } from '@/lib/redis';
import prisma from '@/lib/db';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

const PIONEERS_PER_PAGE = 10;
const CACHE_EXPIRY = 600;
const CACHE_PREFIX = 'pioneers:';

interface LoadPioneersParams {
  lastId: number | null;
  page: number | null;
}

export async function getPioneersFromDB({ lastId, page }: LoadPioneersParams) {
  try {
    const skip = page && page > 1 ? (page - 1) * PIONEERS_PER_PAGE : 0;

    const pioneers = await prisma.pioneer.findMany({
      orderBy: { name: 'asc' },
      take: PIONEERS_PER_PAGE,
      ...(lastId
        ? {
            skip: 1,
            cursor: { id: lastId },
          }
        : page && page > 1
          ? { skip }
          : {}),
    });
    return pioneers;
  } catch (error) {
    logger.error('Database error:', error);
    throw new Error('Failed to fetch pioneers from database');
  }
}

export async function getCachedPioneers(cacheKey: string) {
  const redis = getRedisInstance();
  try {
    const cached = await redis.get(cacheKey);
    return cached ? (JSON.parse(cached) as WikipediaInfo[]) : null;
  } catch (error) {
    logger.error('Cache error:', error);
    return null;
  }
}

export async function setCachedPioneers(
  cacheKey: string,
  data: WikipediaInfo[],
) {
  const redis = getRedisInstance();
  try {
    await redis.set(cacheKey, JSON.stringify(data));
    await redis.expire(cacheKey, CACHE_EXPIRY);
    logger.info('Cache stored successfully');
  } catch (error) {
    logger.error('Cache set error:', error);
  }
}

export async function fetchAndProcessWikipediaData(pioneers: Pioneer[]) {
  try {
    const results = await Promise.allSettled(
      pioneers.map((pioneer) => fetchWikipediaData(pioneer)),
    );

    const processedResults = results
      .filter(
        (result): result is PromiseFulfilledResult<WikipediaInfo> =>
          result.status === 'fulfilled' && result.value !== null,
      )
      .map((result) => result.value);

    logger.info(`Processed ${processedResults.length} Wikipedia entries`);
    return processedResults;
  } catch (error) {
    logger.error('Wikipedia data processing error:', error);
    throw new Error('Failed to process Wikipedia data');
  }
}

export async function loadPioneers({ lastId, page }: LoadPioneersParams) {
  try {
    const pageNo = page ?? 1;
    const cacheKey = `${CACHE_PREFIX}${pageNo}`;

    // Try to get cached data first
    const cachedData = await getCachedPioneers(cacheKey);
    if (cachedData) {
      logger.info('Returning cached data');
      return cachedData;
    }

    // If no cached data, fetch from database
    const pioneers = await getPioneersFromDB({ lastId, page });
    if (pioneers.length === 0) {
      return [];
    }

    // Process and cache the data
    const processedData = await fetchAndProcessWikipediaData(pioneers);
    await setCachedPioneers(cacheKey, processedData);

    return processedData;
  } catch (error) {
    logger.error('Error in loadPioneers:', error);
    throw new Error('Failed to load pioneers');
  }
}
