import { Client } from '@elastic/elasticsearch';
import 'dotenv/config';

const client = new Client({ node: process.env.ELASTIC_URL });

export async function createIndex() {
  const index = 'documents';

  const exists = await client.indices.exists({ index });
  if (exists) {
    await client.indices.delete({ index });
  }
  await client.indices.create({
    index: 'documents',
    body: {
      /*settings: {
        analysis: {
          analyzer: {
            default: {
              type: 'custom', // <-- ESSENCIAL
              tokenizer: 'standard',
              filter: ['lowercase', 'asciifolding', 'stop']
            }
          }
        }
      },
      mappings: {
        dynamic: false,
        properties: {
          id: { type: 'keyword' },
          type: { type: 'keyword' },
          title: {
            type: 'text',
            fields: {
              keyword: { type: 'keyword' },
              ngram: { type: 'text', analyzer: 'standard' }
            }
          },
          description: { type: 'text' },
          popularity_score: { type: 'float' },
          updated_at: { type: 'date' }
        }
      }
        */
       
      /*
        Extras
        Autocomplete (/suggest) com edge_ngram ou completion.
        Sinônimos (synonyms.txt) com reload.
      */
      settings: {
        analysis: {
          filter: {
            autocomplete_filter: {
              type: 'edge_ngram',
              min_gram: 1,
              max_gram: 20
            },
            synonym_filter: {
              type: 'synonym',
              synonyms_path: 'synonyms.txt',
              updateable: true
            }
          },
          analyzer: {
            autocomplete_analyzer: {
              type: 'custom',
              tokenizer: 'standard',
              filter: ['lowercase', 'asciifolding', 'autocomplete_filter']
            },
            synonym_search_analyzer: {
              type: 'custom',
              tokenizer: 'standard',
              filter: ['lowercase', 'asciifolding', 'synonym_filter']
            }
          }
        }
      },
      mappings: {
        dynamic: false,
        properties: {
          id: { type: 'keyword' },
          type: { type: 'keyword' },
          title: {
            type: 'text',
            analyzer: 'autocomplete_analyzer',
            search_analyzer: 'synonym_search_analyzer',
            fields: {
              keyword: { type: 'keyword' }
            }
          },
          description: {
            type: 'text',
            analyzer: 'standard',
            search_analyzer: 'synonym_search_analyzer'
          },
          popularity_score: { type: 'float' },
          updated_at: { type: 'date' }
        }
      }
    }
  });
}
