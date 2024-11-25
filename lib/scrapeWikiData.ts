import axios from 'axios';
import { Pioneer, WikipediaInfo } from './type';

// Fetch detailed information from Wikipedia
export async function fetchWikipediaData(
  pioneer: Pioneer,
): Promise<WikipediaInfo | null> {
  try {
    const wikipediaResponse = await axios.get(
      `https://en.wikipedia.org/w/api.php`,
      {
        params: {
          action: 'query',
          format: 'json',
          titles: pioneer.name,
          prop: 'pageprops|extracts',
          ppprop: 'wikibase_item',
          explaintext: true,
          exintro: true,
          origin: '*',
        },
      },
    );

    const page = Object.values(wikipediaResponse.data.query.pages)[0] as {
      title: string;
      extract: string;
      pageprops?: { wikibase_item?: string };
    };

    if (!page?.pageprops?.wikibase_item)
      throw new Error('Wikidata ID not found');

    // Fetch additional data from Wikidata
    const wikidataResponse = await axios.get(
      'https://www.wikidata.org/w/api.php',
      {
        params: {
          action: 'wbgetentities',
          format: 'json',
          ids: page.pageprops.wikibase_item,
          props: 'claims|labels|descriptions',
          languages: 'en',
          origin: '*',
        },
      },
    );

    const entity = wikidataResponse.data.entities[page.pageprops.wikibase_item];
    const claims = entity.claims;

    // Extract field of work
    const fieldOfWork = claims.P101
      ? await Promise.all(
          claims.P101.map(
            async (claim: {
              mainsnak: { datavalue: { value: { id: number } } };
            }) => {
              const id = claim.mainsnak.datavalue?.value?.id;
              if (id) {
                const labelResponse = await axios.get(
                  'https://www.wikidata.org/w/api.php',
                  {
                    params: {
                      action: 'wbgetentities',
                      ids: id,
                      format: 'json',
                      props: 'labels',
                      languages: 'en',
                      origin: '*',
                    },
                  },
                );
                return labelResponse.data.entities[id].labels.en.value;
              }
              return null;
            },
          ),
        )
      : [];

    // Extract notable works
    const notableWorks = claims.P800
      ? await Promise.all(
          claims.P800.map(
            async (claim: {
              mainsnak: { datavalue: { value: { id: number } } };
            }) => {
              const id = claim.mainsnak.datavalue?.value?.id;
              if (id) {
                const labelResponse = await axios.get(
                  'https://www.wikidata.org/w/api.php',
                  {
                    params: {
                      action: 'wbgetentities',
                      ids: id,
                      format: 'json',
                      props: 'claims|labels|descriptions',
                      languages: 'en',
                      origin: '*',
                    },
                  },
                );

                return labelResponse.data.entities[id].labels.en?.value;
              }
              return null;
            },
          ),
        )
      : [];

    // Fetch image URL
    const imageResponse = await axios.get(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=imageinfo&titles=File:${pioneer.imageFile}&iiprop=url`,
    );

    const imageUrl = imageResponse.data.query.pages[0]?.imageinfo?.[0]?.url;

    return {
      id: pioneer.id,
      name: page.title,
      description: page.extract.substring(0, 251),
      image_url: imageUrl || '',
      fieldOfWork: fieldOfWork.filter(Boolean),
      notableWorks: notableWorks.filter(Boolean),
      wikipedia_link: 'https://en.wikipedia.org/wiki/' + pioneer.wikipediaLink,
    };
  } catch (error) {
    console.error(`Error fetching data for ${pioneer.name}:`, error);
    return null;
  }
}
