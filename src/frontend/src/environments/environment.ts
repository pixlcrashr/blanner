import { GraphqlModule } from '../lib/data/graphql/graphql.module';



export const environment = {
  graphql: {
    uri: 'http://localhost:8965/api/graphql'
  },
  dataModule: GraphqlModule,
  api: {
    http: {
      basePath: 'http://localhost:8965/api/v1'
    }
  }
};
