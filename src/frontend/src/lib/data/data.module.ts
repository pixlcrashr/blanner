import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    environment.dataModule
  ]
})
export class DataModule {
  public static forRoot(): ModuleWithProviders<DataModule> {
    return {
      ngModule: DataModule,
      providers: []
    };
  }
}
