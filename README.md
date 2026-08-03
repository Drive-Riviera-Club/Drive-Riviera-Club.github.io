# DRIVE RIVIERA CLUB

MVP comercial para renta de autos y traslados privados en la Riviera Maya.

Eslogan:
No rentamos autos. Creamos libertad.

Subtítulo:
Your Riviera starts here.

## Tecnologías

- React
- TypeScript
- Vite
- Tailwind CSS
- React Hook Form
- Zod
- Lucide React
- date-fns
- Vitest
- ESLint
- GitHub Actions

## Funcionalidades

- Landing responsive con identidad de marca.
- Flujo de renta de auto con wizard.
- Flujo de traslado privado con autocomplete Geoapify o texto libre sin API key.
- Resumen previo al envío por WhatsApp.
- Folios locales para cada solicitud.
- Modo sin API key totalmente funcional.
- Componentes listos para GitHub Pages sin backend.

## Autocomplete de ubicaciones

El flujo de traslado usa Geoapify Address Autocomplete cuando existe `VITE_GEOAPIFY_API_KEY`.

- Busca con sesgo de proximidad hacia Cancún y Riviera Maya.
- Usa `lang=es` y filtro por México.
- Limita sugerencias a 6 resultados.
- Espera 300 ms antes de consultar.
- Permite navegación por teclado, Escape y cierre al hacer clic fuera.

Si no existe la variable, el flujo cambia a texto libre sin bloquear el wizard.

Atribución requerida:
Geocoding powered by Geoapify / OpenStreetMap contributors

## Variables de entorno

Crea un archivo `.env` a partir de `.env.example`:

- `VITE_GEOAPIFY_API_KEY=`
- `VITE_WHATSAPP_NUMBER=52XXXXXXXXXX`
- `VITE_REPOSITORY_NAME=NOMBRE-REPOSITORIO`

Nota: las variables `VITE_` se exponen en el bundle del navegador. La clave debe restringirse por referrer, origin y CORS.

### Orígenes de ejemplo para restringir

- `http://localhost:5173`
- `https://joseemmanuelvg.github.io`
- `https://joseemmanuelvg.github.io/Car_Dealership-JEVG/`

## Geoapify

Para crear la clave:

1. Crea una cuenta o proyecto en Geoapify.
2. Genera una API key para frontend.
3. Restringe la key por HTTP referrer, origin y CORS.
4. Autoriza desarrollo local y GitHub Pages.
5. No uses claves sin restricciones.

## WhatsApp

La solicitud se envía con un enlace `wa.me` precargado.

No confirma automáticamente la reserva.

## Instalación

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev
npm run lint
npm run test
npm run test -- --run
npm run build
npm run preview
```

## Estructura

- `src/components` UI y secciones
- `src/components/maps` autocomplete y contenedores reutilizables
- `src/components/wizards` flujos de renta y traslado
- `src/config` variables del negocio
- `src/data` datos editables
- `src/lib` lógica, validaciones y mensajes
- `src/tests` pruebas unitarias

## Pruebas

Cobertura principal:

- Validación de origen vacío.
- Validación de destino vacío.
- Texto libre sin API key.
- Normalización de selección Geoapify.
- Mensaje WhatsApp con origen y destino.
- Manejo de error en consultas Geoapify.
- Carga sin `VITE_GEOAPIFY_API_KEY`.

Ejecutar:

```bash
npm run test -- --run
```

## Build y preview

```bash
npm run build
npm run preview
```

## GitHub Pages

El proyecto está preparado para una ruta como:

`https://USUARIO.github.io/NOMBRE-REPOSITORIO/`

### Configuración

1. Ve a Settings > Pages.
2. En Source, selecciona GitHub Actions.
3. Añade las variables en Settings > Secrets and variables > Actions > Variables.
4. Haz push a `main` o ejecuta el workflow manualmente.

### Variables en GitHub Actions

- `VITE_GEOAPIFY_API_KEY`
- `VITE_WHATSAPP_NUMBER`

`VITE_REPOSITORY_NAME` se toma automáticamente del nombre del repositorio.

## Despliegue

El workflow `.github/workflows/deploy.yml` ejecuta:

- `npm ci`
- `npm run lint`
- `npm run test -- --run`
- `npm run build`
- publicación de `dist` en GitHub Pages

## Limitaciones del MVP

- No hay backend.
- No hay base de datos.
- No hay pago real.
- La disponibilidad se confirma por WhatsApp.

## Roadmap

- Tarifas por distancia para traslados.
- Cotización avanzada por zonas.
- Panel administrativo.
- Historial de solicitudes.
