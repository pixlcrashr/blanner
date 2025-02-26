import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiModule, Configuration } from './client';
import { environment } from '../../../environments/environment';
import { ImportDialogDataService } from '../../../app/import/import-dialog/import-dialog-data.service';
import { HttpImportDialogDataService } from './services/http-import-dialog-data.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ApiModule.forRoot(() => new Configuration({
      basePath: environment.api.http.basePath
    }))
  ],
  providers: [
    {
      provide: ImportDialogDataService,
      useClass: HttpImportDialogDataService
    }
  ]
})
export class HttpModule {
}
