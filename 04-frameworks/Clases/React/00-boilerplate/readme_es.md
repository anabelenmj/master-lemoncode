# 00 Boilerplate — Rick & Morty

Punto de partida. Aquí no escribimos aplicación todavía: montamos el proyecto desde cero, le instalamos el React Compiler, levantamos el servidor y comprobamos que las dos piezas se hablan.

## Qué vamos a construir

Una aplicación con el catálogo de personajes de Rick & Morty:

- Una **pantalla de login** contra nuestro propio servidor, con sesión por cookie.
- Un **listado de personajes** en tarjetas.
- Una **pantalla de detalle** con sus episodios.

Y por el camino, las herramientas que se usan hoy en un proyecto de verdad: enrutado, validación con **zod**, formularios con las novedades de React 19 y estilos. Al final del día cogemos todo eso y lo **colocamos con una arquitectura** que aguante crecer.

## Las dos piezas del proyecto

Este proyecto tiene **dos programas** que se arrancan a la vez:

| Pieza        | Carpeta   | Puerto | Qué hace                                 |
| ------------ | --------- | ------ | ---------------------------------------- |
| **Front**    | `src/`    | 5173   | La aplicación de React, servida por Vite |
| **Servidor** | `server/` | 3000   | Nuestra API, hecha con Hono              |

> ⚠️ Si tienes otro proyecto ocupando alguno de esos puertos, ciérralo antes: el servidor avisa con un error `EADDRINUSE`. El puerto del servidor se puede cambiar con la variable de entorno `PORT`.

### ¿Por qué un servidor propio y no atacar directamente a la API pública?

Porque hay cosas que **solo se pueden enseñar con un servidor delante**:

- **El login.** Una API pública no te autentica. Aquí vas a ver una sesión de verdad, con su cookie.
- **Proteger la cookie.** La cookie de sesión se marca como `httpOnly`, que significa que el JavaScript de la página **no puede leerla**. Es lo que se hace en producción.
- **Romper el contrato a propósito.** Más adelante arrancaremos el servidor en modo «roto», devolviendo los datos con otra forma, y veremos cómo zod lo detecta antes de que reviente la pantalla.
- **Dar los datos ya masticados.** La API pública devuelve el personaje con muchos campos anidados; nuestro servidor lo aplana y manda solo lo que la pantalla necesita.

## El proyecto de React

> **Aquí usamos pnpm.** Si vienes de npm, los comandos se parecen: `pnpm install` para instalar, `pnpm add` en vez de `npm install <paquete>`, y los scripts se lanzan sin el `run` (`pnpm start:server`). Guarda los paquetes una sola vez en el disco y los enlaza en cada proyecto, así que instala mucho más rápido.

Está generado con el andamiaje oficial de Vite, el mismo que usarías hoy en un proyecto nuevo:

```bash
pnpm create vite@latest 00-boilerplate --template react-ts
```

De ahí salen `index.html`, `src/main.tsx`, `src/App.tsx`, los `tsconfig` y el `vite.config.ts`. **Tal cual, sin nada añadido**: el compilador lo ponemos nosotros.

## Paso a paso: instalar el React Compiler

El andamiaje de Vite **no lo trae puesto**. Lo instalamos nosotros, que son dos cosas.

### 1. El paquete que hace la transformación

```bash
pnpm add -D oxc-transform-react
```

> El plugin de React para Vite sabe hablar con el compilador, pero la transformación en sí la hace este paquete. Si activas el compilador sin instalarlo, Vite te avisa al arrancar.

### 2. Activarlo en la configuración

_./vite.config.ts_

```diff
  export default defineConfig({
-   plugins: [react()],
+   plugins: [react({ compiler: true })],
  })
```

Y ya está. No hay que tocar ni una línea de los componentes.

### La diferencia, medida

En la portada hay una demo preparada: un campo de texto y, al lado, un componente hijo que **cuenta cuántas veces se ha ejecutado**. El hijo recibe siempre la misma prop y no lleva `React.memo`.

**Escribe diez letras en el campo y mira el contador.** Con el compilador desactivado y con él activado:

|                       | Al cargar | Tras escribir 10 letras |
| --------------------- | --------- | ----------------------- |
| **Sin el compilador** | 2         | **24**                  |
| **Con el compilador** | 2         | **2**                   |

El hijo es el mismo código en los dos casos. La diferencia la pone el compilador, que al compilar el padre guarda el trozo de JSX del hijo y lo reutiliza, porque su prop no cambia.

Para verlo en directo: quita el `compiler: true`, reinicia Vite (la configuración no se recarga en caliente) y vuelve a escribir.

⚠️ Tres avisos:

- **Si editas un componente y ves un error imposible** —algo que está inicializado y te sale `undefined`—, **recarga la página entera**. La recarga en caliente conserva la caché que monta el compilador, y si el fichero ha cambiado de forma, esa caché se queda desfasada. Pasa poco, pero cuando pasa vuelve loco a cualquiera.
- **Solo optimiza el código que cumple las reglas de React.** Si un componente muta sus props o llama a hooks dentro de un `if`, el compilador se lo salta. No rompe nada, pero tampoco lo optimiza.
- **No te ahorra entender el problema.** Si algo va lento porque el estado está demasiado arriba, el compilador no te lo va a bajar él.

## Los estilos: Tailwind y daisyUI, ya puestos

**Esto es una clase de React, no de CSS.** Para no perder tiempo peleándonos con hojas de estilo, el proyecto trae ya dos cosas instaladas:

```bash
pnpm add -D tailwindcss @tailwindcss/vite daisyui
```

_./vite.config.ts_

```diff
+ import tailwindcss from "@tailwindcss/vite";

  export default defineConfig({
-   plugins: [react({ compiler: true })],
+   plugins: [react({ compiler: true }), tailwindcss()],
  })
```

_./src/index.css_

```css
@import "tailwindcss";
@plugin "daisyui";

/* Un tema propio: azul espacio de fondo y verde portal como color principal.
   daisyUI calcula solo el resto de tonos: bordes, textos, estados. */
@plugin "daisyui/theme" {
  name: "portal";
  default: true;
  color-scheme: dark;

  --color-base-100: oklch(22% 0.03 265); /* tarjetas */
  --color-base-200: oklch(17% 0.03 265); /* fondo */
  --color-base-300: oklch(30% 0.03 265); /* bordes */
  --color-base-content: oklch(93% 0.01 265);

  --color-primary: oklch(70% 0.14 145); /* verde portal */
  --color-primary-content: oklch(16% 0.04 145);

  --color-error: oklch(75% 0.15 25);
  --color-error-content: oklch(18% 0.05 25);

  --radius-box: 1rem;
  --radius-field: 0.5rem;
}
```

**daisyUI trae temas hechos** —`dark`, `forest`, `cupcake`…— y se activan con una palabra. Aquí definimos **el nuestro**: le damos los colores base y el principal, y él calcula el resto. Cambiar esos valores cambia la aplicación entera sin tocar un componente.

### Los colores, medidos

⚠️ **Que un color lo dé una librería no significa que sea accesible.** Los de aquí están comprobados con la pestaña de accesibilidad de las DevTools, que da el contraste al pinchar cualquier texto:

|                                  | Contraste | WCAG   |
| -------------------------------- | --------- | ------ |
| Texto normal sobre la tarjeta    | 14,1      | ✅ AAA |
| Texto del botón sobre el verde   | 7,6       | ✅ AAA |
| Mensaje de error bajo un campo   | 7,3       | ✅ AAA |
| Texto de la alerta sobre el rojo | 8,0       | ✅ AAA |

**AA pide 4,5 para texto normal y AAA pide 7.** Dos cosas que salieron de medir, y que conviene contar:

- **El rojo por defecto de daisyUI se quedaba en 4,42** en la alerta —por debajo del mínimo—, así que lo aclaramos y fijamos también el color del texto.
- **El primer verde que probamos pasaba AAA de sobra (10,6) y aun así molestaba**: tenía casi 11 de contraste contra el fondo oscuro, y en una superficie grande eso deslumbra. Cumplir el mínimo no basta; pasarse tampoco es gratis.

**Qué aporta cada uno:**

- **Tailwind** son clases sueltas para las medidas: `flex`, `gap-4`, `p-10`, `max-w-xl`, `text-3xl`. En vez de escribir CSS en otro fichero, lo pones en el elemento.
- **daisyUI** es un plugin de Tailwind que añade **componentes ya vestidos**: `btn`, `card`, `input`, `badge`, `navbar`. Un `<button className="btn btn-primary">` ya sale bien puesto, con su color, su tamaño y su estado de pulsado.

> Con esto **no vamos a escribir CSS propio en todo el recorrido**. No porque el CSS no importe —tiene su bloque en el máster—, sino porque aquí queremos mirar a React. Si un ejemplo sale bonito de serie, la atención se queda en el `useState` y no en el `padding`.

**La tipografía** se carga desde Google Fonts en el `index.html` y se le dice a Tailwind cuál es la suya en el `index.css`:

```css
@theme {
  --font-sans: "Roboto", system-ui, sans-serif;
  --font-display: "Space Grotesk", "Roboto", sans-serif;
}
```

Roboto para el texto y Space Grotesk para los títulos. Con `@theme`, Tailwind se lleva esas fuentes a sus utilidades (`font-sans`, `font-display`) y las aplica por defecto a toda la página.

➕ **Para ver lo que da de sí:** sustituye todo el bloque del tema propio por `@plugin "daisyui" { themes: cupcake --default; }` y mira la aplicación. Cambia entera, sin tocar un componente.

## ¿Por qué el contador sube de dos en dos? `<StrictMode>`

Es la primera pregunta que sale al ver la demo, y merece su explicación.

### Qué es

Está en `src/main.tsx`, envolviendo la aplicación entera, y lo pone la plantilla de Vite:

```tsx
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

**Solo actúa en desarrollo.** En el build de producción no hace nada: ni siquiera va al bundle.

### Qué hace

Mientras desarrollas, React **ejecuta dos veces**:

- El **cuerpo de los componentes**, es decir, la función de render.
- Los **inicializadores** de `useState` y `useMemo`.
- Los **efectos**: los monta, los desmonta y los vuelve a montar.

### Por qué lo hace

Porque React exige que los componentes sean **puros**: con las mismas props y el mismo estado, el mismo resultado, y **sin efectos secundarios durante el pintado**. React se reserva el derecho de ejecutar tu componente cuando le convenga, o de descartar un render a medias, y eso solo es seguro si tu función es pura.

Si tu componente es puro, **ejecutarlo dos veces no cambia nada** y ni te enteras. Si no lo es, el doble ejecutado **destapa el fallo en tu máquina en vez de en producción**. Es un detector de impurezas.

> Es como probar una receta dos veces: si sale lo mismo, la receta está bien escrita. Si la segunda vez sale distinto, es que había algo escondido.

### Y nuestro contador es justo uno de esos casos

`RenderProbe` **escribe en un ref durante el render**, que es exactamente lo que React pide que no hagas. Por eso sube de dos en dos: **la propia demo es un ejemplo de lo que StrictMode está diseñado para destapar.** Lo hacemos a propósito, porque queremos contar ejecuciones, y es la única razón por la que se permite.

### De dónde salen los 24

| Qué pasa                                               | Ejecuciones |
| ------------------------------------------------------ | ----------- |
| Montaje inicial                                        | 2           |
| Llega la respuesta de `/api/health` y cambia el estado | 2           |
| Diez teclas × 2                                        | 20          |
| **Total**                                              | **24**      |

En producción sería la mitad: 1, 1 y 10 → **12**.

### Compruébalo

Quita el `<React.StrictMode>` de `main.tsx`, guarda y repite la prueba: los números se quedan en la mitad. Vuelve a ponerlo después.

⚠️ **Y no lo quites porque moleste ver los logs repetidos.** Si el doble ejecutado te rompe algo, **ese algo ya estaba roto**: lo único que ha hecho StrictMode es enseñártelo antes de que lo vea un usuario.

➕ Esto enlaza con el compilador que acabamos de instalar: como **solo optimiza los componentes que cumplen las reglas**, la pureza deja de ser una recomendación y pasa a ser la condición para que te optimicen el código.

## El proxy, y por qué nos ahorra un dolor de cabeza

Nuestro front va a hablar con nuestro servidor. Para que el navegador los vea como **el mismo sitio**, Vite hace de intermediario:

_./vite.config.ts_

```diff
  export default defineConfig({
    plugins: [react({ compiler: true })],
+   server: {
+     proxy: {
+       "/api": "http://localhost:3000",
+     },
+   },
  })
```

El front pide `/api/algo` **a su propia dirección** y Vite se lo reenvía al servidor. Con eso:

- **No hay que configurar CORS.**
- **La cookie de sesión viaja sola**, sin tocar nada.

Si el front llamara a `http://localhost:3000` directamente, tendríamos que pelearnos con las dos cosas. En producción este papel lo hace un nginx, o el propio servidor sirviendo el front ya construido.

## El servidor: `server/index.ts`

Está hecho con [Hono](https://hono.dev), un framework de servidor minúsculo, parecido a Express pero moderno y tipado. Se ejecuta con `tsx`, que corre TypeScript directamente sin compilar.

```bash
pnpm add hono @hono/node-server zod
pnpm add -D tsx npm-run-all2
```

Y los scripts del `package.json`, para levantar las dos piezas con un solo comando:

```json
"start": "run-p -l start:server start:front",
"start:front": "vite --host",
"start:server": "tsx watch server/index.ts",
"start:server:broken": "BREAK_API=true tsx watch server/index.ts"
```

> `run-p` lo pone **npm-run-all**: ejecuta varios scripts **en paralelo** (`run-s` sería en serie) y con `-l` etiqueta cada línea de la consola con el script del que viene, que es lo que hace legible tener dos procesos escribiendo a la vez.

Lo que expone:

| Método | Ruta                          | Qué hace                                                                                                                          |
| ------ | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/api/health`                 | Comprobar que el servidor está vivo                                                                                               |
| `POST` | `/api/login`                  | Recibe usuario y contraseña; si son válidos, deja la cookie de sesión                                                             |
| `POST` | `/api/logout`                 | Borra la cookie                                                                                                                   |
| `GET`  | `/api/me`                     | Quién soy, leyendo la cookie. `401` si no hay sesión                                                                              |
| `GET`  | `/api/characters?page=&name=` | Página de personajes, ya aplanados. Los parámetros están ahí para quien quiera montarse el buscador y la paginación por su cuenta |
| `GET`  | `/api/characters/:id`         | Un personaje con sus primeros episodios                                                                                           |

Detalles pensados para clase:

- **Las peticiones tardan a propósito** (entre 400 y 800 ms). Sin eso, los estados de carga no se ven y no se pueden explicar.
- **El usuario de prueba es `admin` / `test`**, escrito a pelo en el fichero.
- **Modo roto:** `pnpm start:server:broken` devuelve `characterId` en vez de `id`. Lo usaremos al llegar a zod.
- **Modo caos:** `curl -X POST http://localhost:3000/api/chaos` hace que `/api/characters` conteste con un `500`. Se enciende y se apaga en caliente, sin reiniciar nada, y sirve para probar los estados de error.

## Arrancar

```bash
pnpm install
pnpm start
```

> ⚠️ **La primera vez, pnpm avisa de que ha ignorado un script de instalación** (`Ignored build scripts: esbuild`). Es su protección por defecto: no deja que un paquete ejecute código al instalarse si no lo has autorizado. `esbuild` lo necesita para colocar su binario, y por eso el proyecto trae un `pnpm-workspace.yaml` con la autorización:
>
> ```yaml
> allowBuilds:
>   esbuild: true
> ```

`pnpm start` levanta las dos cosas a la vez (con `npm-run-all`) y etiqueta cada línea con el script del que viene. Si prefieres dos terminales:

```bash
pnpm start:server   # el servidor, en el 3000
pnpm start:front    # el front, en el 5173
```

Abre <http://localhost:5173> y deberías ver la portada con **dos indicadores en verde**: el front y el servidor. Si el del servidor sale en rojo, es que solo arrancó el front.

## Comprobar el servidor por tu cuenta

Sin tocar el navegador, desde otra terminal:

```bash
# ¿está vivo?
curl http://localhost:3000/api/health

# login (guardamos la cookie en un fichero)
curl -c cookies.txt -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"test"}'

# ¿quién soy? (mandando la cookie)
curl -b cookies.txt http://localhost:3000/api/me

# personajes
curl "http://localhost:3000/api/characters?page=1&name=rick"
```

## Lo que hay que mirar antes de seguir

- `vite.config.ts` — el compiler y el proxy.
- `server/index.ts` — las rutas de la API. No hace falta entenderlo entero: lo iremos abriendo según lo usemos.
- `src/App.tsx` — la portada con la demo del compilador. Es lo único que se tira en el paso siguiente.
- `src/index.css` — tres líneas: Tailwind y el tema de daisyUI.

**Siguiente:** `01-routing` — la aplicación deja de ser una sola pantalla.
