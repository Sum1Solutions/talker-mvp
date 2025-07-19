// This is a Cloudflare Worker that handles SPA routing
// It ensures that all routes serve index.html for client-side routing

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Serve static assets directly
  if (url.pathname.includes('.')) {
    return fetch(request)
  }

  // For all other paths, serve index.html
  return fetch(new URL('/index.html', request.url), request)
}
