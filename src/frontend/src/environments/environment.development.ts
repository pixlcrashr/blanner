import { GraphqlModule } from '../lib/data/graphql/graphql.module';



export const environment = {
  graphql: {
    uri: 'http://localhost:8123/api/graphql'
  },
  dataModule: GraphqlModule,
  api: {
    http: {
      basePath: 'http://localhost:8123/api/v1'
    }
  }
};
