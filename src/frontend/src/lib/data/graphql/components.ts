import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  AccountId: { input: string; output: string; }
  BookId: { input: string; output: string; }
  BudgetAccountTargetId: { input: string; output: string; }
  BudgetId: { input: string; output: string; }
  Currency: { input: string; output: string; }
  Date: { input: string; output: string; }
  DateTime: { input: Date; output: Date; }
  Double: { input: number; output: number; }
  Long: { input: string; output: string; }
  PeriodId: { input: string; output: string; }
  TransactionId: { input: string; output: string; }
};

export type Account = {
  __typename?: 'Account';
  book: Book;
  bookId: Scalars['BookId']['output'];
  budgetValues: Array<AccountBudgetValue>;
  children: Array<Account>;
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  depth: Scalars['Int']['output'];
  description: Scalars['String']['output'];
  fullCode: Scalars['String']['output'];
  id: Scalars['AccountId']['output'];
  isGroup: Scalars['Boolean']['output'];
  isParent: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  parent?: Maybe<Account>;
  parentId?: Maybe<Scalars['AccountId']['output']>;
  transactions: Array<Transaction>;
  type: AccountType;
  updatedAt: Scalars['DateTime']['output'];
};

export type AccountBudgetValue = {
  __typename?: 'AccountBudgetValue';
  actual: Money;
  budget: Budget;
  budgetId: Scalars['BudgetId']['output'];
  difference: Money;
  target: Money;
};

export enum AccountType {
  Expense = 'EXPENSE',
  Income = 'INCOME'
}

export type Book = {
  __typename?: 'Book';
  accounts: Array<Account>;
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['Currency']['output'];
  description: Scalars['String']['output'];
  id: Scalars['BookId']['output'];
  name: Scalars['String']['output'];
  startMonth: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Budget = {
  __typename?: 'Budget';
  actualValues: Array<BudgetAccountActual>;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['BudgetId']['output'];
  name: Scalars['String']['output'];
  period: Period;
  periodId: Scalars['PeriodId']['output'];
  targetValues: Array<BudgetAccountTarget>;
  updatedAt: Scalars['DateTime']['output'];
};

export type BudgetAccountActual = {
  __typename?: 'BudgetAccountActual';
  account: Account;
  accountId: Scalars['AccountId']['output'];
  budget: Budget;
  budgetId: Scalars['BudgetId']['output'];
  value: Money;
};

export type BudgetAccountTarget = {
  __typename?: 'BudgetAccountTarget';
  account: Account;
  accountId: Scalars['AccountId']['output'];
  budget: Budget;
  budgetId: Scalars['BudgetId']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['BudgetAccountTargetId']['output'];
  updatedAt: Scalars['DateTime']['output'];
  value: Money;
};

export enum ImportProvider {
  Lexware = 'LEXWARE'
}

export type Matrix = {
  __typename?: 'Matrix';
  accounts: Array<MatrixAccountNode>;
  budgets: Array<MatrixBudgetNode>;
  maxDepth: Scalars['Int']['output'];
  values: Array<Array<MatrixValue>>;
};

export type MatrixAccountNode = {
  __typename?: 'MatrixAccountNode';
  account: Account;
  accountId: Scalars['AccountId']['output'];
  depth: Scalars['Int']['output'];
  parentIndex?: Maybe<Scalars['Int']['output']>;
};

export type MatrixBudgetNode = {
  __typename?: 'MatrixBudgetNode';
  budget: Budget;
  budgetId: Scalars['BudgetId']['output'];
};

export type MatrixInput = {
  bookId: Scalars['BookId']['input'];
  ignoreAccounts?: InputMaybe<Array<Scalars['AccountId']['input']>>;
  ignoreBudgets?: InputMaybe<Array<Scalars['BudgetId']['input']>>;
};

export type MatrixValue = {
  __typename?: 'MatrixValue';
  actual: Money;
  difference: Money;
  target: Money;
};

export type Money = {
  __typename?: 'Money';
  currency: Scalars['Currency']['output'];
  decimal: Scalars['Double']['output'];
  format: Scalars['String']['output'];
  minUnit: Scalars['Long']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  closePeriod: Scalars['Boolean']['output'];
  createAccount: Account;
  createBook: Book;
  createBudget: Budget;
  createTransaction: Transaction;
  deleteAccount: Scalars['Boolean']['output'];
  deleteBook: Scalars['Boolean']['output'];
  deleteBudget: Scalars['Boolean']['output'];
  deleteBudgetAccountTarget: Scalars['Boolean']['output'];
  deleteTransaction: Scalars['Boolean']['output'];
  ignoreImportReference: Scalars['Boolean']['output'];
  setBudgetAccountTarget: Scalars['Boolean']['output'];
  updateAccount: Account;
  updateBook: Book;
  updateBudget: Budget;
  updateTransaction: Transaction;
};


export type MutationClosePeriodArgs = {
  id: Scalars['PeriodId']['input'];
};


export type MutationCreateAccountArgs = {
  bookId: Scalars['BookId']['input'];
  code: Scalars['String']['input'];
  description: Scalars['String']['input'];
  isGroup: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['AccountId']['input']>;
  type: AccountType;
};


export type MutationCreateBookArgs = {
  currency: Scalars['Currency']['input'];
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  startMonth: Scalars['Int']['input'];
};


export type MutationCreateBudgetArgs = {
  bookId: Scalars['BookId']['input'];
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  year: Scalars['Int']['input'];
};


export type MutationCreateTransactionArgs = {
  accountId: Scalars['AccountId']['input'];
  bookedAt: Scalars['Date']['input'];
  description: Scalars['String']['input'];
  importProvider?: InputMaybe<ImportProvider>;
  importReference?: InputMaybe<Scalars['String']['input']>;
  value: Scalars['Long']['input'];
};


export type MutationDeleteAccountArgs = {
  id: Scalars['AccountId']['input'];
};


export type MutationDeleteBookArgs = {
  id: Scalars['BookId']['input'];
};


export type MutationDeleteBudgetArgs = {
  id: Scalars['BudgetId']['input'];
};


export type MutationDeleteBudgetAccountTargetArgs = {
  accountId: Scalars['AccountId']['input'];
  id: Scalars['BudgetId']['input'];
};


export type MutationDeleteTransactionArgs = {
  id: Scalars['TransactionId']['input'];
};


export type MutationIgnoreImportReferenceArgs = {
  bookID: Scalars['BookId']['input'];
  provider: ImportProvider;
  reference: Scalars['String']['input'];
};


export type MutationSetBudgetAccountTargetArgs = {
  accountId: Scalars['AccountId']['input'];
  id: Scalars['BudgetId']['input'];
  value: Scalars['Long']['input'];
};


export type MutationUpdateAccountArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['AccountId']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateBookArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['BookId']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateBudgetArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['BudgetId']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateTransactionArgs = {
  accountId?: InputMaybe<Scalars['AccountId']['input']>;
  id: Scalars['TransactionId']['input'];
};

export type Period = {
  __typename?: 'Period';
  bookId: Scalars['BookId']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['PeriodId']['output'];
  isClosed: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
  year: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  account?: Maybe<Account>;
  accounts: Array<Maybe<Account>>;
  book?: Maybe<Book>;
  books: Array<Maybe<Book>>;
  budget?: Maybe<Budget>;
  budgets: Array<Maybe<Budget>>;
  currencies: Array<Scalars['Currency']['output']>;
  matrix: Matrix;
  period?: Maybe<Period>;
  periods: Array<Maybe<Period>>;
  searchAccounts: Array<Account>;
  searchBooks: Array<Book>;
  searchBudgets: Array<Budget>;
  searchPeriods: Array<Period>;
  searchTransactions: Array<Transaction>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Maybe<Transaction>>;
};


export type QueryAccountArgs = {
  id: Scalars['AccountId']['input'];
};


export type QueryAccountsArgs = {
  ids: Array<Scalars['AccountId']['input']>;
};


export type QueryBookArgs = {
  id: Scalars['BookId']['input'];
};


export type QueryBooksArgs = {
  ids: Array<Scalars['BookId']['input']>;
};


export type QueryBudgetArgs = {
  id: Scalars['BudgetId']['input'];
};


export type QueryBudgetsArgs = {
  ids: Array<Scalars['BudgetId']['input']>;
};


export type QueryMatrixArgs = {
  input: MatrixInput;
};


export type QueryPeriodArgs = {
  id: Scalars['PeriodId']['input'];
};


export type QueryPeriodsArgs = {
  ids: Array<Scalars['PeriodId']['input']>;
};


export type QuerySearchAccountsArgs = {
  input: SearchAccountsInput;
};


export type QuerySearchBudgetsArgs = {
  input: SearchBudgetsInput;
};


export type QuerySearchPeriodsArgs = {
  input: SearchPeriodsInput;
};


export type QuerySearchTransactionsArgs = {
  input: SearchTransactionsInput;
};


export type QueryTransactionArgs = {
  id: Scalars['TransactionId']['input'];
};


export type QueryTransactionsArgs = {
  ids: Array<Scalars['TransactionId']['input']>;
};

export type SearchAccountsInput = {
  bookId?: InputMaybe<Scalars['BookId']['input']>;
  isGroup?: InputMaybe<Scalars['Boolean']['input']>;
  parentId?: InputMaybe<Scalars['AccountId']['input']>;
};

export type SearchBudgetsInput = {
  bookId?: InputMaybe<Scalars['BookId']['input']>;
  periodId?: InputMaybe<Scalars['PeriodId']['input']>;
};

export type SearchPeriodsInput = {
  bookId?: InputMaybe<Scalars['BookId']['input']>;
};

export type SearchTransactionsInput = {
  accountId?: InputMaybe<Scalars['AccountId']['input']>;
  bookId?: InputMaybe<Scalars['BookId']['input']>;
};

export type Transaction = {
  __typename?: 'Transaction';
  account: Account;
  accountId: Scalars['AccountId']['output'];
  bookedAt: Scalars['Date']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['TransactionId']['output'];
  importProvider?: Maybe<ImportProvider>;
  importReference?: Maybe<Scalars['String']['output']>;
  isImported: Scalars['Boolean']['output'];
  reference: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  value: Money;
};

export type AddAccountDialogData_AddAccountMutationVariables = Exact<{
  bookId: Scalars['BookId']['input'];
  name: Scalars['String']['input'];
  description: Scalars['String']['input'];
  type: AccountType;
  code: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['AccountId']['input']>;
  isGroup: Scalars['Boolean']['input'];
}>;


export type AddAccountDialogData_AddAccountMutation = { __typename?: 'Mutation', createAccount: { __typename?: 'Account', id: string, code: string } };

export type AddBookDialogData_AddBookMutationVariables = Exact<{
  name: Scalars['String']['input'];
  description: Scalars['String']['input'];
  startMonth: Scalars['Int']['input'];
}>;


export type AddBookDialogData_AddBookMutation = { __typename?: 'Mutation', createBook: { __typename?: 'Book', id: string } };

export type AddBudgetDialogData_AddBudgetMutationVariables = Exact<{
  bookId: Scalars['BookId']['input'];
  name: Scalars['String']['input'];
  description: Scalars['String']['input'];
  year: Scalars['Int']['input'];
}>;


export type AddBudgetDialogData_AddBudgetMutation = { __typename?: 'Mutation', createBudget: { __typename?: 'Budget', id: string } };

export type ImportTableActionsData_CreateTransactionMutationVariables = Exact<{
  accountId: Scalars['AccountId']['input'];
  value: Scalars['Long']['input'];
  description: Scalars['String']['input'];
  bookedAt: Scalars['Date']['input'];
  importProvider: ImportProvider;
  importReference: Scalars['String']['input'];
}>;


export type ImportTableActionsData_CreateTransactionMutation = { __typename?: 'Mutation', createTransaction: { __typename?: 'Transaction', id: string } };

export type ImportTableActionsData_IgnoreImportReferenceMutationVariables = Exact<{
  bookId: Scalars['BookId']['input'];
  provider: ImportProvider;
  reference: Scalars['String']['input'];
}>;


export type ImportTableActionsData_IgnoreImportReferenceMutation = { __typename?: 'Mutation', ignoreImportReference: boolean };

export type JournalData_DeleteTransactionMutationVariables = Exact<{
  transactionId: Scalars['TransactionId']['input'];
}>;


export type JournalData_DeleteTransactionMutation = { __typename?: 'Mutation', deleteTransaction: boolean };

export type JournalData_ChangeTransactionAccountMutationVariables = Exact<{
  transactionId: Scalars['TransactionId']['input'];
  accountId: Scalars['AccountId']['input'];
}>;


export type JournalData_ChangeTransactionAccountMutation = { __typename?: 'Mutation', updateTransaction: { __typename?: 'Transaction', id: string } };

export type OverviewTableAccountNameInputData_UpdateAccountNameMutationVariables = Exact<{
  accountId: Scalars['AccountId']['input'];
  name: Scalars['String']['input'];
}>;


export type OverviewTableAccountNameInputData_UpdateAccountNameMutation = { __typename?: 'Mutation', updateAccount: { __typename?: 'Account', id: string } };

export type OverviewTableTargetValueInputData_UpdateTargetValueMutationVariables = Exact<{
  accountId: Scalars['AccountId']['input'];
  budgetId: Scalars['BudgetId']['input'];
  value: Scalars['Long']['input'];
}>;


export type OverviewTableTargetValueInputData_UpdateTargetValueMutation = { __typename?: 'Mutation', setBudgetAccountTarget: boolean };

export type AddAccountDialogData_GetDataQueryVariables = Exact<{
  bookId: Scalars['BookId']['input'];
}>;


export type AddAccountDialogData_GetDataQuery = { __typename?: 'Query', searchAccounts: Array<{ __typename?: 'Account', id: string, name: string, parentId?: string | null, type: AccountType, depth: number }> };

export type ImportData_GetAccountsQueryVariables = Exact<{
  bookId: Scalars['BookId']['input'];
}>;


export type ImportData_GetAccountsQuery = { __typename?: 'Query', searchAccounts: Array<{ __typename?: 'Account', id: string, name: string, type: AccountType, fullCode: string, code: string, depth: number }> };

export type JournalData_GetJournalDataQueryVariables = Exact<{
  bookId: Scalars['BookId']['input'];
}>;


export type JournalData_GetJournalDataQuery = { __typename?: 'Query', searchTransactions: Array<{ __typename?: 'Transaction', id: string, reference: string, isImported: boolean, accountId: string, bookedAt: string, value: { __typename?: 'Money', decimal: number } }>, searchAccounts: Array<{ __typename?: 'Account', id: string, name: string, type: AccountType }> };

export type LayoutBookMenuData_ListBooksQueryVariables = Exact<{ [key: string]: never; }>;


export type LayoutBookMenuData_ListBooksQuery = { __typename?: 'Query', searchBooks: Array<{ __typename?: 'Book', id: string, name: string }> };

export type OverviewData_GetOverviewDataQueryVariables = Exact<{
  bookId: Scalars['BookId']['input'];
}>;


export type OverviewData_GetOverviewDataQuery = { __typename?: 'Query', matrix: { __typename?: 'Matrix', maxDepth: number, accounts: Array<{ __typename?: 'MatrixAccountNode', parentIndex?: number | null, depth: number, accountId: string, account: { __typename?: 'Account', type: AccountType, name: string, code: string, fullCode: string, isGroup: boolean } }>, budgets: Array<{ __typename?: 'MatrixBudgetNode', budgetId: string, budget: { __typename?: 'Budget', name: string } }>, values: Array<Array<{ __typename?: 'MatrixValue', target: { __typename?: 'Money', decimal: number }, actual: { __typename?: 'Money', decimal: number }, difference: { __typename?: 'Money', decimal: number } }>> } };

export const AddAccountDialogData_AddAccountDocument = gql`
    mutation addAccountDialogData_addAccount($bookId: BookId!, $name: String!, $description: String!, $type: AccountType!, $code: String!, $parentId: AccountId, $isGroup: Boolean!) {
  createAccount(
    bookId: $bookId
    name: $name
    description: $description
    type: $type
    code: $code
    isGroup: $isGroup
    parentId: $parentId
  ) {
    id
    code
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AddAccountDialogData_AddAccountGQL extends Apollo.Mutation<AddAccountDialogData_AddAccountMutation, AddAccountDialogData_AddAccountMutationVariables> {
    document = AddAccountDialogData_AddAccountDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AddBookDialogData_AddBookDocument = gql`
    mutation addBookDialogData_addBook($name: String!, $description: String!, $startMonth: Int!) {
  createBook(
    name: $name
    currency: "EUR"
    description: $description
    startMonth: $startMonth
  ) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AddBookDialogData_AddBookGQL extends Apollo.Mutation<AddBookDialogData_AddBookMutation, AddBookDialogData_AddBookMutationVariables> {
    document = AddBookDialogData_AddBookDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AddBudgetDialogData_AddBudgetDocument = gql`
    mutation addBudgetDialogData_addBudget($bookId: BookId!, $name: String!, $description: String!, $year: Int!) {
  createBudget(
    bookId: $bookId
    name: $name
    description: $description
    year: $year
  ) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AddBudgetDialogData_AddBudgetGQL extends Apollo.Mutation<AddBudgetDialogData_AddBudgetMutation, AddBudgetDialogData_AddBudgetMutationVariables> {
    document = AddBudgetDialogData_AddBudgetDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ImportTableActionsData_CreateTransactionDocument = gql`
    mutation importTableActionsData_createTransaction($accountId: AccountId!, $value: Long!, $description: String!, $bookedAt: Date!, $importProvider: ImportProvider!, $importReference: String!) {
  createTransaction(
    accountId: $accountId
    value: $value
    description: $description
    bookedAt: $bookedAt
    importProvider: $importProvider
    importReference: $importReference
  ) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ImportTableActionsData_CreateTransactionGQL extends Apollo.Mutation<ImportTableActionsData_CreateTransactionMutation, ImportTableActionsData_CreateTransactionMutationVariables> {
    document = ImportTableActionsData_CreateTransactionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ImportTableActionsData_IgnoreImportReferenceDocument = gql`
    mutation importTableActionsData_ignoreImportReference($bookId: BookId!, $provider: ImportProvider!, $reference: String!) {
  ignoreImportReference(
    bookID: $bookId
    provider: $provider
    reference: $reference
  )
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ImportTableActionsData_IgnoreImportReferenceGQL extends Apollo.Mutation<ImportTableActionsData_IgnoreImportReferenceMutation, ImportTableActionsData_IgnoreImportReferenceMutationVariables> {
    document = ImportTableActionsData_IgnoreImportReferenceDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const JournalData_DeleteTransactionDocument = gql`
    mutation journalData_deleteTransaction($transactionId: TransactionId!) {
  deleteTransaction(id: $transactionId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class JournalData_DeleteTransactionGQL extends Apollo.Mutation<JournalData_DeleteTransactionMutation, JournalData_DeleteTransactionMutationVariables> {
    document = JournalData_DeleteTransactionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const JournalData_ChangeTransactionAccountDocument = gql`
    mutation journalData_changeTransactionAccount($transactionId: TransactionId!, $accountId: AccountId!) {
  updateTransaction(id: $transactionId, accountId: $accountId) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class JournalData_ChangeTransactionAccountGQL extends Apollo.Mutation<JournalData_ChangeTransactionAccountMutation, JournalData_ChangeTransactionAccountMutationVariables> {
    document = JournalData_ChangeTransactionAccountDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const OverviewTableAccountNameInputData_UpdateAccountNameDocument = gql`
    mutation overviewTableAccountNameInputData_updateAccountName($accountId: AccountId!, $name: String!) {
  updateAccount(id: $accountId, name: $name) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class OverviewTableAccountNameInputData_UpdateAccountNameGQL extends Apollo.Mutation<OverviewTableAccountNameInputData_UpdateAccountNameMutation, OverviewTableAccountNameInputData_UpdateAccountNameMutationVariables> {
    document = OverviewTableAccountNameInputData_UpdateAccountNameDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const OverviewTableTargetValueInputData_UpdateTargetValueDocument = gql`
    mutation overviewTableTargetValueInputData_updateTargetValue($accountId: AccountId!, $budgetId: BudgetId!, $value: Long!) {
  setBudgetAccountTarget(id: $budgetId, accountId: $accountId, value: $value)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class OverviewTableTargetValueInputData_UpdateTargetValueGQL extends Apollo.Mutation<OverviewTableTargetValueInputData_UpdateTargetValueMutation, OverviewTableTargetValueInputData_UpdateTargetValueMutationVariables> {
    document = OverviewTableTargetValueInputData_UpdateTargetValueDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AddAccountDialogData_GetDataDocument = gql`
    query addAccountDialogData_getData($bookId: BookId!) {
  searchAccounts(input: {bookId: $bookId, isGroup: true}) {
    id
    name
    parentId
    type
    depth
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AddAccountDialogData_GetDataGQL extends Apollo.Query<AddAccountDialogData_GetDataQuery, AddAccountDialogData_GetDataQueryVariables> {
    document = AddAccountDialogData_GetDataDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ImportData_GetAccountsDocument = gql`
    query importData_getAccounts($bookId: BookId!) {
  searchAccounts(input: {bookId: $bookId, isGroup: false}) {
    id
    name
    type
    fullCode
    code
    depth
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ImportData_GetAccountsGQL extends Apollo.Query<ImportData_GetAccountsQuery, ImportData_GetAccountsQueryVariables> {
    document = ImportData_GetAccountsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const JournalData_GetJournalDataDocument = gql`
    query journalData_getJournalData($bookId: BookId!) {
  searchTransactions(input: {bookId: $bookId}) {
    id
    reference
    isImported
    accountId
    value {
      decimal
    }
    bookedAt
  }
  searchAccounts(input: {bookId: $bookId}) {
    id
    name
    type
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class JournalData_GetJournalDataGQL extends Apollo.Query<JournalData_GetJournalDataQuery, JournalData_GetJournalDataQueryVariables> {
    document = JournalData_GetJournalDataDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LayoutBookMenuData_ListBooksDocument = gql`
    query layoutBookMenuData_listBooks {
  searchBooks {
    id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LayoutBookMenuData_ListBooksGQL extends Apollo.Query<LayoutBookMenuData_ListBooksQuery, LayoutBookMenuData_ListBooksQueryVariables> {
    document = LayoutBookMenuData_ListBooksDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const OverviewData_GetOverviewDataDocument = gql`
    query overviewData_getOverviewData($bookId: BookId!) {
  matrix(input: {bookId: $bookId}) {
    accounts {
      parentIndex
      depth
      accountId
      account {
        type
        name
        code
        fullCode
        isGroup
      }
    }
    budgets {
      budgetId
      budget {
        name
      }
    }
    maxDepth
    values {
      target {
        decimal
      }
      actual {
        decimal
      }
      difference {
        decimal
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class OverviewData_GetOverviewDataGQL extends Apollo.Query<OverviewData_GetOverviewDataQuery, OverviewData_GetOverviewDataQueryVariables> {
    document = OverviewData_GetOverviewDataDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }