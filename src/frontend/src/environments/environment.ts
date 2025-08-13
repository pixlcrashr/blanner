import { MockModule } from '../lib/data/mock/mock.module';



export const environment = {
  graphql: {
    uri: 'http://localhost:8965/api/graphql'
  },
  dataModule: MockModule,
  api: {
    http: {
      basePath: 'http://localhost:8965/api/v1'
    }
  }
};
