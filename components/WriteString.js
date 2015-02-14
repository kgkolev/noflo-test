var noflo = require('noflo');

exports.getComponent = function () {
  var c = new noflo.Component();
  var string = null;
  var request = null;

  c.inPorts.add('in', function (event, httpReq) {
    switch (event) {
      case 'data': {
        request = httpReq;
        break;
      }
      case 'disconnect': {
        c.outPorts.out.connect();
        break;
      }
    }
  });
  
  c.inPorts.add('string', function (event, htmlBody) {
    switch (event) {
      case 'connect': {
        string = '';
      	break;
      }
      case 'data': {
        string = htmlBody;
        break;
      }
      case 'disconnect': {
        c.outPorts.out.connect();
        break;
      }
    }
  });
  
  c.outPorts.add('out', function(event) {
    if (event == 'connect' && request && string) {
      request.res.write = string;
      c.outPorts.out.send(request);
      request = null;
      c.outPorts.out.disconnect();
    }
  });
  return c;
};
