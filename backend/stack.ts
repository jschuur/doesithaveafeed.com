import { Api, StackContext } from 'sst/constructs';

export function API({ stack }: StackContext) {
  const api = new Api(stack, 'api', {
    routes: {
      'GET /check': 'backend/src/check.handler',
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return api;
}
