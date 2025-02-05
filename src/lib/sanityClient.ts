import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, 
  dataset: 'production',       
  useCdn: false,                
  apiVersion: '2024-02-05',    
  token: process.env.SANITY_CLIENT_TOKEN,  
});