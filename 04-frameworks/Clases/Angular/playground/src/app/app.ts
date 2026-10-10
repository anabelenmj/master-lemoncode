import { Component, signal, effect, computed } from '@angular/core';
import { Search } from './utils/search/search';
import { UserList } from './user/user-list/user-list';
// import { RouterOutlet } from '@angular/router';

@Component({
  imports: [
    // RouterOutlet
    //Search,
    UserList
  ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('playground');

  isLower = signal(true);

  updatedTitle = computed(() => {
    if (this.isLower()) {
      return this.title()
    } else {
      return this.title().toLocaleUpperCase();
    }
  })

  //effect es una función que me asegura que siempre va a ejecutarse. La vamos a utilizar ahora para debuggear las funciones. Se suele utilizar para sincronizar sistemas externos a angular
  effect = effect(() => {
    console.log(this.isLower());

  });

  //Actualizamos la signal con update
  toggleUpper() {
    /* this.title.update((val) => {
      return val.toLocaleUpperCase();
    }); */
    this.isLower.update(v => !v)
  }

  escribeEnLog($event: string) {
    console.log($event);
  }
}