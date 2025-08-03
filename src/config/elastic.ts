import { Client } from '@elastic/elasticsearch';
import 'dotenv/config';

if (!process.env.ELASTIC_URL) {
  throw new Error('ELASTIC_URL não definido no .env');
}

export const client = new Client({ 
  node: process.env.ELASTIC_URL,
  auth: process.env.ELASTIC_AUTH ? {
    username: process.env.ELASTIC_AUTH.split(':')[0],
    password: process.env.ELASTIC_AUTH.split(':')[1]
  } : undefined
});