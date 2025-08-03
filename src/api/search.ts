import express from 'express';
import { client } from '../config/elastic';

export const searchRouter = express.Router();

searchRouter.get('/', async (req, res) => {
  // preciso garantir que os parâmetros são strings
  const q = typeof req.query.q === 'string' ? req.query.q : '';
  const type = typeof req.query.type === 'string' ? req.query.type : 'all';
  const sort = typeof req.query.sort === 'string' ? req.query.sort : 'relevance';
  //const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : 1;
  //const size = typeof req.query.size === 'string' ? parseInt(req.query.size) : 10;
  const page = typeof req.query.page === 'string' ? Math.max(1, parseInt(req.query.page)) : 1;
  const size = typeof req.query.size === 'string' ? Math.min(50, Math.max(1, parseInt(req.query.size))) : 10;

  const query = {
    bool: {
      must: q ? [{
        multi_match: { 
          query: q, // garantido ser string
          fields: ['title^2', 'description'], 
          fuzziness: 'AUTO' as const
        }
      }] : [],
      //filter: type !== 'all' ? [{ term: { type } }] : []
      filter: type !== 'all' ? [{ term: { type: { value: type } } }] : []
    }
  };

  const sortField = sort === 'recent' ? [{ updated_at: { order: 'desc' as const } }]
    : sort === 'popular' ? [{ popularity_score: { order: 'desc' as const } }]
    : undefined;

  try {
    const result = await client.search<Document>({ 
      index: 'documents',
      from: (page - 1) * size,
      size,
      query,
      ...(sortField && { sort: sortField }) // spread condicional
    });

    res.json(result.hits.hits.map(h => h._source));
  } catch (error) {
    console.error('Elasticsearch error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});