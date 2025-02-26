import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewDataService } from '../../../app/overview/overview-data.service';
import { MockOverviewDataService } from './services/mock-overview-data.service';
import { MockAddAccountDialogDataService } from './services/mock-add-account-dialog-data.service';
import { AddAccountDialogDataService } from '../../../app/add-account-dialog/add-account-dialog-data.service';
import { ImportDialogDataService } from '../../../app/import/import-dialog/import-dialog-data.service';
import { MockImportDialogDataService } from './services/mock-import-dialog-data.service';
import {
  ImportTableActionsDataService
} from '../../../app/import/import-table-actions/import-table-actions-data.service';
import { MockImportTableActionsDataService } from './services/mock-import-table-actions-data.service';
import {
  OverviewTableTargetValueInputDataService
} from '../../../app/overview/overview-table/overview-table-target-value-input/overview-table-target-value-input-data.service';
import {
  MockOverviewTableTargetValueInputDataService
} from './services/mock-overview-table-target-value-input-data.service';
import {
  OverviewTableAccountNameInputDataService
} from '../../../app/overview/overview-table/overview-table-account-name-input/overview-table-account-name-input-data.service';
import {
  MockOverviewTableAccountNameInputDataService
} from './services/mock-overview-table-account-name-input-data.service';
import { JournalDataService } from '../../../app/journal/journal-data.service';
import { MockJournalDataService } from './services/mock-journal-data.service';
import { AddBudgetDialogDataService } from '../../../app/add-budget-dialog/add-budget-dialog-data.service';
import { MockAddBudgetDialogDataService } from './services/mock-add-budget-dialog-data.service';
import { LayoutBookMenuDataService } from '../../../app/layout/layout-book-menu/layout-book-menu-data.service';
import { MockLayoutBookMenuDataService } from './services/mock-layout-book-menu-data.service';
import { ImportDataService } from '../../../app/import/import-data.service';
import { MockImportDataService } from './services/mock-import-data.service';
import { AddBookDialogDataService } from '../../../app/add-book-dialog/add-book-dialog-data.service';
import { MockAddBookDialogDataService } from './services/mock-add-book-dialog-data.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: OverviewDataService,
      useClass: MockOverviewDataService
    },
    {
      provide: AddAccountDialogDataService,
      useClass: MockAddAccountDialogDataService
    },
    {
      provide: ImportDialogDataService,
      useClass: MockImportDialogDataService
    },
    {
      provide: ImportTableActionsDataService,
      useClass: MockImportTableActionsDataService
    },
    {
      provide: OverviewTableTargetValueInputDataService,
      useClass: MockOverviewTableTargetValueInputDataService
    },
    {
      provide: OverviewTableAccountNameInputDataService,
      useClass: MockOverviewTableAccountNameInputDataService
    },
    {
      provide: JournalDataService,
      useClass: MockJournalDataService
    },
    {
      provide: AddBudgetDialogDataService,
      useClass: MockAddBudgetDialogDataService
    },
    {
      provide: LayoutBookMenuDataService,
      useClass: MockLayoutBookMenuDataService
    },
    {
      provide: ImportDataService,
      useClass: MockImportDataService
    },
    {
      provide: AddBookDialogDataService,
      useClass: MockAddBookDialogDataService
    }
  ]
})
export class MockModule {
}
