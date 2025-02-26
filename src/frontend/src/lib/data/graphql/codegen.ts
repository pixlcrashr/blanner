import { CodegenConfig } from '@graphql-codegen/cli';
/*- typescript
  - typescript - operations
  - typescript - apollo - angular */

const config: CodegenConfig = {
  schema: './src/lib/data/graphql/schema.gql',
  generates: {
    'src/lib/data/graphql/components.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-apollo-angular'],
      documents: 'src/lib/data/graphql/**/*.gql',
      config: {
        scalars: {
          Long: 'string',
          Date: 'string',
          DateTime: 'Date',
          Double: 'number',
          Currency: 'string',
          BookId: 'string',
          PeriodId: 'string',
          BudgetId: 'string',
          AccountId: 'string',
          TransactionId: 'string',
          BudgetAccountTargetId: 'string'
        }
      }
    }
  }
};

export default config;
