import { Client } from '@elastic/elasticsearch';
import { createIndex } from '../index/mapping';
import 'dotenv/config';
//const { createIndex } = require('../index/mapping');

type Document = {
  id: string;
  type: 'product' | 'event' | 'article';
  title: string;
  description: string;
  popularity_score: number;
  updated_at: string;
};

const data: Document[] = require('./mock_data.json');

const client = new Client({ node: process.env.ELASTIC_URL });

async function seed() {
  await createIndex();

  const body = data.flatMap((doc) => [{ index: { _index: 'documents' } }, doc]);

  await client.bulk({ refresh: true, body });

  console.log('Seed concluído com sucesso!');
}

seed();
