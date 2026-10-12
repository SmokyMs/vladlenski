function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (request.headers.host.value.toLowerCase() === 'www.gavronski.dev') {
    var parameters = [];

    // CloudFront keeps query strings separate from the URI. multiValue includes
    // the first value as well as duplicates; retain existing percent encoding.
    Object.keys(request.querystring).forEach(function (name) {
      var parameter = request.querystring[name];
      var values = parameter.multiValue || [parameter];

      values.forEach(function (item) {
        parameters.push(name + '=' + item.value);
      });
    });

    var location = 'https://gavronski.dev' + uri;
    if (parameters.length > 0) {
      location += '?' + parameters.join('&');
    }

    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        location: { value: location }
      }
    };
  }

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
