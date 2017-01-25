const curlTemplate = 'curl {url} \\\n' +
  '  -X {method} \\\n' +
  '  -H "Content-Type: application/json" \\\n' +
  '  -H "X-Linkr-Key: YOUR_API_KEY" \\\n' +
  '  -d \'{data}\'';

const pythonTemplate = 'import requests\n' +
  '\n' +
  'requests.{method}(\n' +
  '    url=\'{url}\'\n' +
  '    json={data}\n' +
  ')';

const javascriptTemplate = 'const request = require(\'request\')\n' +
  '\n' +
  'request.{method}({\n' +
  '  url: \'{url}\',\n' +
  '  json: {data}\n' +
  '}, (err, resp, body) => console.log(body));';

// Mapping of languages names to the corresponding code template
export default {
  curl: curlTemplate,
  python: pythonTemplate,
  javascript: javascriptTemplate
};
