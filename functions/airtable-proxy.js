export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { path, method, data } = body;

    if (!path) {
      return new Response(JSON.stringify({ error: 'Missing path' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const airtableUrl = `https://api.airtable.com/v0/${path}`;
    const fetchMethod = method || 'GET';

    const fetchOptions = {
      method: fetchMethod,
      headers: {
        'Authorization': `Bearer ${context.env.AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    if (data && ['POST', 'PATCH', 'PUT'].includes(fetchMethod)) {
      fetchOptions.body = JSON.stringify(data);
    }

    const response = await fetch(airtableUrl, fetchOptions);
    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
