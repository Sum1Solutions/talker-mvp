
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/predict' && request.method === 'POST') {
      const { text } = await request.json();
      // TODO: swap this stub for real prediction call to Presage/OpenAI
      const dummy = ['hello', 'how', 'help', 'hi', 'house', 'have'];
      const last = text.split(' ').pop()?.toLowerCase() || '';
      const suggestions = dummy.filter(w => w.startsWith(last)).slice(0, 3);
      return Response.json({ suggestions });
    }
    return new Response('Not found', { status: 404 });
  },
};
