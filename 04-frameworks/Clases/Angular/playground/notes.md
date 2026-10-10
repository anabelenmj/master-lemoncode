# Sesión 1 - Components:
- Angular utiliza decoradores para saber que es en runtime
  - Ejemplo -> Componente = clase que use `@Component` 
- Componente Angular - Hospedar la lógica asociada con una región de la vista
  - Template →> HTML + syntaxis ANGULAR
  - `CSS`
  - TS

- Las propiedades publicas de los componentes se puede mostrar/sincronizar/interactuar con el Template
  - `{{ }}` - Interpolar un valor
  - `[ ]` - Enlazar una propiedad (TS) contra un atributo en el Template
  - `()` - Enlazar eventos en el Template y asociar métodos funciones en el TS

```html
<p>{{ label() }}</p>

<div class="container">
  <!-- <input type="text" class="field" value="{{name}}" /> -->
  <input type="text" [placeholder]="ph()" class="field" [value]="name" />
  <div class="icons-container">
    <div class="icon-search" (click)="changeName ()">
  </div>
</div>
```

- La comunicación de padre a hijo
  - `input` - Signal

- La comunicación de hijo a padre
  - `output` - Event Emitter

## Signals
- Signal - es una primitiva reactiva: en el momento que le asigno a una signal un valor, se cambia en cualquier sitio que tenga una referencia de ello

- Tenemos dos formas de actualizar una signal:
  - 1. Set() - Establecer un valor. Se utiliza cuando ya saber cual es el valor que quieres asignar
  - 2. update() - Modificar el valor actual mediante una función. Se utiliza cuando necesitas calcular el nuevo valor a partir del anterior
 

