import { Component, input, output } from '@angular/core';

/*
@Input() - input()
@Output() - output()
*/

// obj2 -> obj1
@Component({
  imports: [],
  selector: 'app-search',
  styleUrl: './search.css',
  templateUrl: './search.html',
})

export class Search {
  ph = input('Buscar...');
  label = input('Buscar:');

  name = 'Paco';

  clickEnLupa = output<string>();
  otroEvento = output<void>();

  changeName() {
    this.toggleName()
    this.clickEnLupa.emit(this.name);
  }

  //Para conservar el nombre anterior y que sea toggle
  private toggleName() {
    const firtsLetter = this.name[0];

    if (firtsLetter === 'P') {
      this.name = 'Francisco'
    } else if (firtsLetter === 'F') {
      this.name = 'Paco'
    }
  }
}