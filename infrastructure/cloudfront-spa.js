function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (
    uri === '/infrastructure' ||
    uri === '/infrastructure/' ||
    uri === '/projects' ||
    uri === '/projects/' ||
    uri === '/resume' ||
    uri === '/resume/'
  ) {
    request.uri = '/index.html';
  }

  return request;
}
