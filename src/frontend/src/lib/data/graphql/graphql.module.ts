import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '../http/http.module';
import { AddAccountDialogDataService } from '../../../app/add-account-dialog/add-account-dialog-data.service';
import { GraphqlAddAccountDialogDataService } from './services/graphql-add-account-dialog-data.service';
import { AddBudgetDialogDataService } from '../../../app/add-budget-dialog/add-budget-dialog-data.service';
import { GraphqlAddBudgetDialogDataService } from './services/graphql-add-budget-dialog-data.service';
import {
  ImportTableActionsDataService
} from '../../../app/import/import-table-actions/import-table-actions-data.service';
import { GraphqlImportTableActionsDataService } from './services/graphql-import-table-actions-data.service';
import { JournalDataService } from '../../../app/journal/journal-data.service';
import { GraphqlJournalDataService } from './services/graphql-journal-data.service';
import { LayoutBookMenuDataService } from '../../../app/layout/layout-book-menu/layout-book-menu-data.service';
import { GraphqlLayoutBookMenuDataService } from './services/graphql-layout-book-menu-data.service';
import { GraphqlOverviewDataService } from './services/graphql-overview-data.service';
import { OverviewDataService } from '../../../app/overview/overview-data.service';
import {
  OverviewTableAccountNameInputDataService
} from '../../../app/overview/overview-table/overview-table-account-name-input/overview-table-account-name-input-data.service';
import {
  GraphqlOverviewTableAccountNameInputDataService
} from './services/graphql-overview-table-account-name-input-data.service';
import {
  OverviewTableTargetValueInputDataService
} from '../../../app/overview/overview-table/overview-table-target-value-input/overview-table-target-value-input-data.service';
import {
  GraphqlOverviewTableTargetValueInputDataService
} from './services/graphql-overview-table-target-value-input-data.service';
import { ImportDataService } from '../../../app/import/import-data.service';
import { GraphqlImportDataService } from './services/graphql-import-data.service';
import { AddBookDialogDataService } from '../../../app/add-book-dialog/add-book-dialog-data.service';
import { GraphqlAddBookDialogDataService } from './services/graphql-add-book-dialog-data.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpModule
  ],
  providers: [
    {
      provide: AddAccountDialogDataService,
      useClass: GraphqlAddAccountDialogDataService
    },
    {
      provide: AddBudgetDialogDataService,
      useClass: GraphqlAddBudgetDialogDataService
    },
    {
      provide: ImportTableActionsDataService,
      useClass: GraphqlImportTableActionsDataService
    },
    {
      provide: JournalDataService,
      useClass: GraphqlJournalDataService
    },
    {
      provide: LayoutBookMenuDataService,
      useClass: GraphqlLayoutBookMenuDataService
    },
    {
      provide: OverviewDataService,
      useClass: GraphqlOverviewDataService
    },
    {
      provide: OverviewTableAccountNameInputDataService,
      useClass: GraphqlOverviewTableAccountNameInputDataService
    },
    {
      provide: OverviewTableTargetValueInputDataService,
      useClass: GraphqlOverviewTableTargetValueInputDataService
    },
    {
      provide: ImportDataService,
      useClass: GraphqlImportDataService
    },
    {
      provide: AddBookDialogDataService,
      useClass: GraphqlAddBookDialogDataService
    }
  ]
})
export class GraphqlModule {
}
