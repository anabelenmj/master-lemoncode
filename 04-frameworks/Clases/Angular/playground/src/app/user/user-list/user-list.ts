import { Component, OnInit, signal } from '@angular/core';
import { MemberEntity } from '../../model';
import { FormsModule, NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  imports: [
    //NgModel, //recoge el estado de los inputs y del componente, es decir, los datos que ha cambiado el usuario
    //NgForm, 
    FormsModule, //me trae ngModel y ngForm
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})

//OnInit -> añadimos ciclo de vida al componente
export class UserList implements OnInit {
  //member es una signal de tipo MemberEntity que se inicializa como un array vacío
  members = signal<MemberEntity[]>([]);
  newMember!: MemberEntity;

  add(): void {
    this.members.update((members) => [...members, this.newMember]);
    this.newMember = {
      id: '',
      login: '',
      avatar_url: '',
    }
  }

  handleFileInput($event: Event) {
    const files = ($event.target as HTMLInputElement).files as FileList;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.newMember.avatar_url = reader.result as string;
    }
  }

  ngOnInit() {
    fetch('https://api.github.com/orgs/lemoncode/members')
      .then((response) => response.json())
      .then((results) => {
        console.log(JSON.stringify(results));
        this.members.set(results);
      })
      .catch((err) => { console.log(err) })

    this.newMember = {
      id: '',
      login: '',
      avatar_url: '',
    }
  }
}
