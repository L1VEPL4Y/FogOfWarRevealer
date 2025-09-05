import type { RequestHandler } from '@sveltejs/kit';

type SSEClient = {
  send: (data: string) => void;
  close: () => void;
};
let clients: SSEClient[] = [];
let latestMap: string | null = null;

export const GET: RequestHandler = async ({ request }) => {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const send = (data: string) => {
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };

      // store this connection
      const client: SSEClient = {
        send,
        close: () => {
            clients = clients.filter(c => c !== client);
        }
      } as any;

      clients.push(client);
      
      if(latestMap){
        client.send(latestMap);
      }

      request.signal.addEventListener('abort', () => {
        client.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  });
};

export const POST: RequestHandler = async ({ request }) => {
    const req = await request.json();
    const map = req.map;
    if (typeof map !== 'string' || !map.startsWith('data:image')) {
        console.log("map wrong:",map);
        return new Response('Invalid Map Image', { status: 400 });
    }
    latestMap = map;
    for (const client of clients){
        try {
            client.send(map);
        } catch (err) {
            // stream is closed, drop this client
            clients = clients.filter(c => c !== client);
        }   
    }

    return new Response(JSON.stringify({ success: true}), {
        headers: { 'Content-Type': 'application/json' }
    });


};