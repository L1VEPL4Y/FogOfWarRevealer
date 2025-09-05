import type { RequestHandler } from '@sveltejs/kit';

type SSEClient = {
  send: (data: string) => void;
  close: () => void;
};
let clients: SSEClient[] = [];
let latestMask: string | null = null;

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

      if(latestMask){
        client.send(latestMask);
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
  const mask = req.mask;

  if (typeof mask !== 'string' || !mask.startsWith('data:image/png')) {
    return new Response('Invalid Mask', { status: 400 });
  }
  latestMask = mask;
  for (const client of clients){
        try {
            client.send(mask);
        } catch (err) {
            // stream is closed, drop this client
            clients = clients.filter(c => c !== client);
        }  
  }

  return new Response(JSON.stringify({ success: true}), {
    headers: { 'Content-Type': 'application/json' }
  });


};

