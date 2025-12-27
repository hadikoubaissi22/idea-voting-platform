import { Component, signal } from '@angular/core';
import { IdeasPage } from './features/ideas/pages/ideas-page/ideas-page';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IdeasPage],
  template: `<app-ideas-page></app-ideas-page>`
})
export class App {
  protected readonly title = signal('Idea Voting Platform');
}
