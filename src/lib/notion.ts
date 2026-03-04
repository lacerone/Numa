import { Client } from '@notionhq/client';

// Inizializza il client (lo teniamo per getPageBlocks, se funziona)
const notion = new Client({ auth: process.env.NOTION_TOKEN });

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  tags: string[];
  author: string;
  cover: string | null;
};

// Funzione che usa fetch per interrogare il database
async function queryDatabase() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  const token = process.env.NOTION_TOKEN;

  if (!databaseId || !token) {
    throw new Error('Mancano le variabili d\'ambiente');
  }

  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      filter: {
        property: 'Published',        // OK, questa colonna esiste
        checkbox: { equals: true },
      },
      sorts: [
        {
          property: 'Publish Date',    // <--- Corretto: usa "Publish Date"
          direction: 'descending',
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Errore Notion API: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const data = await queryDatabase();

    const posts = data.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        title: props.title?.title[0]?.plain_text || props.Title?.title[0]?.plain_text || 'Senza titolo',
        slug: (() => {
              // Se esiste uno slug personalizzato in Notion, lo usiamo (ma normalizzato)
              const rawSlug = props.Slug?.rich_text[0]?.plain_text;
              if (rawSlug) {
                return rawSlug
                  .toLowerCase()
                  .replace(/\s+/g, '-')           // spazi -> trattini
                  .replace(/[^\w\-]+/g, '')        // rimuovi caratteri speciali
                  .replace(/\-\-+/g, '-')          // evita doppi trattini
                  .replace(/^-+/, '')              // togli trattini iniziali
                  .replace(/-+$/, '');             // togli trattini finali
              }
              // Altrimenti, genera slug dal titolo
              return props.Title?.title[0]?.plain_text
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '') || 'articolo';
            })(),
        description: props.Description?.rich_text[0]?.plain_text || '',
        date: props['Publish Date']?.date?.start || '',   // <--- Corretto: accesso con parentesi
        tags: props.Tags?.multi_select?.map((tag: any) => tag.name) || [],
        author: props.Author?.rich_text[0]?.plain_text || 'Anonimo',
        cover: props.Cover?.files[0]?.file?.url || props.Cover?.files[0]?.external?.url || null,
      };
    });

    return posts;
  } catch (error) {
    console.error('Errore nel fetch da Notion:', error);
    return [];
  }
}

export async function getPageBlocks(pageId: string) {
  // Se anche questo dovesse dare problemi, possiamo sostituirlo con fetch
  // Per ora manteniamo il client ufficiale, che potrebbe funzionare
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
    });
    return response.results;
  } catch (error) {
    console.error('Errore nel recupero dei blocchi:', error);
    return [];
  }
}