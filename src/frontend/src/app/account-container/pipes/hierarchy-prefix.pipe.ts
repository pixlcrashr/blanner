import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';



@Pipe({
  name: 'hierarchyPrefix'
})
export class HierarchyPrefixPipe implements PipeTransform {
  private readonly _domSanitizer = inject(DomSanitizer);

  transform(depth: number): SafeHtml {
    if (depth === 0) {
      return '';
    }

    return this._domSanitizer.bypassSecurityTrustHtml(`${new Array((depth - 1) * 5).fill('&nbsp;').join('')}└─`);
  }

}
