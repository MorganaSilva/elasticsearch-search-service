import express from 'express';
import { client } from '../config/elastic';

export const suggestRouter = express.Router();

type DocumentSource = {
  title: string;
};

suggestRouter.get('/', async (req, res) => {
  const q = String(req.query.q || '').trim();

  if (!q) {
    return res.status(400).json({ error: 'Missing query parameter ?q=' });
  }

  const result = await client.search<DocumentSource>({
    index: 'documents',
    size: 5,
    query: {
      match_phrase_prefix: {
        title: {
          query: q
        }
      }
    },
    _source: ['title']
  });

  const suggestions = result.hits.hits.map((hit) => hit._source?.title);
  res.json({ suggestions });
});
