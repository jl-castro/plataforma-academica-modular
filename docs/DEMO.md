# Escenarios de demostración del prototipo

## Tesis

**Marco de diseño para la construcción de aplicaciones web componibles mediante microfrontends y carga dinámica de módulos**

## Prototipo

**Plataforma Académica Modular**

---

## 1. Propósito general de la demo

La demostración del prototipo no tiene como finalidad mostrar un sistema académico completo, sino evidenciar que el marco de diseño arquitectónico propuesto puede traducirse en decisiones arquitectónicas observables dentro de una aplicación web componible.

La demo debe demostrar que el prototipo cumple con los elementos centrales del marco:

- delimitación modular;
- contratos explícitos;
- integración dinámica;
- comunicación desacoplada;
- capacidad de evolución controlada.

Por ello, la presentación debe enfocarse en escenarios arquitectónicos notorios y no en funcionalidades pequeñas de negocio. El objetivo es que se perciba que la plataforma no es una aplicación común con varias pantallas, sino una estructura componible basada en microfrontends independientes, coordinados por un shell y gobernados por contratos, eventos y mecanismos de integración dinámica.

---

## 2. Configuración previa a la sustentación

### Estado del manifiesto

Para la demo, **Dashboard debe estar `"inactivo"`** en `shell/src/assets/manifest.json`. Así:

- la entrada sigue declarada en el contrato (C2);
- no aparece en la navbar durante los pasos 1–8;
- el paso 9 puede activarlo en vivo cambiando `"inactivo"` → `"activo"`.

Los tres módulos principales (Estudiantes, Inscripciones, Calificaciones) permanecen `"activo"`.

> **Nota:** La ruta `/dashboard` sigue registrada en el routing del shell por diseño del prototipo. Durante la demo, navegar únicamente desde la navbar evita confusión. Tras la sustentación, se puede volver a dejar Dashboard en `"activo"` para desarrollo cotidiano.

### Servicios a levantar (pasos 0–8)

Levantar **cuatro** servicios, **sin Dashboard**:

```bash
cd mf-estudiantes && npm start    # 4201
cd mf-inscripciones && npm start  # 4202
cd mf-calificaciones && npm start # 4203
cd shell && npm start             # 4200
```

Verificar en `http://localhost:4200` que la navbar muestra **tres** módulos con punto verde (online).

### Pestañas útiles

| URL | Uso |
| --- | --- |
| `http://localhost:4201` | Paso 1 — Estudiantes standalone |
| `http://localhost:4202` | Paso 1 — Inscripciones standalone |
| `http://localhost:4203` | Paso 1 — Calificaciones standalone |
| `http://localhost:4200` | Pasos 2–10 — Shell |
| `http://localhost:4200/assets/manifest.json` | Paso 3 — Contrato arquitectónico |

### Ensayo obligatorio

Antes de la sustentación, practicar:

1. Selección de estudiante → Inscripciones → Calificaciones (evento).
2. Apagar `mf-calificaciones` (Ctrl+C) → error controlado → otros módulos OK.
3. Reconectar Calificaciones.
4. Activar Dashboard en manifest + levantar `mf-dashboard` + F5 en shell.

**Estudiante sugerido para el paso 5:** Carlos Eduardo Flores (id 2). Evita Ana Lucía, que es el perfil demo automático en modo standalone.

---

## 3. Guion paso a paso

Duración estimada: **18–25 minutos**.

| Paso | Escenario | Criterios del marco |
| --- | --- | --- |
| 0 | Preparación | — |
| 1 | Microfrontends independientes | C1 |
| 2–4 | Shell, manifiesto y carga dinámica | C1, C2, C3 |
| 5–6 | Comunicación desacoplada y consola | C2, C4 |
| 7–8 | Falla controlada y recuperación | C1, C3, C5 |
| 9 | Incorporación de Dashboard | C2, C3, C5 |
| 10 | Cierre | Todos |

---

### Paso 0 — Preparación inicial

Levantar los cuatro servicios indicados en la sección 2. **No levantar Dashboard.**

---

### Paso 1 — Microfrontends independientes

Abrir en pestañas separadas:

1. `http://localhost:4201` — Estudiantes  
2. `http://localhost:4202` — Inscripciones  
3. `http://localhost:4203` — Calificaciones  

**Qué decir:**

> Estos módulos no son componentes internos de una misma aplicación. Son aplicaciones frontend independientes, cada una con su propio proyecto, configuración y puerto.

**Matiz para Inscripciones y Calificaciones en standalone:**

> En modo independiente cada módulo opera con datos locales de demostración. La coordinación por eventos ocurre cuando están integrados en el shell.

**Evidencia:** tres aplicaciones Angular separadas en puertos distintos.

---

### Paso 2 — Abrir el shell

Abrir `http://localhost:4200`.

**Qué decir:**

> Ahora ingreso al shell. El shell funciona como aplicación contenedora u orquestadora. Su responsabilidad es cargar estos microfrontends y presentarlos como una sola plataforma. En términos simples, el shell es una aplicación host que consume e integra microfrontends remotos.

**Qué mostrar:**

- Navbar con **tres** módulos activos (sin Dashboard).
- Consola arquitectónica en la parte inferior.
- Ausencia de lógica académica en el shell.

---

### Paso 3 — Mostrar el manifiesto

Abrir `http://localhost:4200/assets/manifest.json` (o el archivo en el editor).

**Qué decir:**

> La integración no se hace de manera improvisada. Cada microfrontend está declarado en un manifiesto que funciona como contrato arquitectónico. El shell sabe qué módulos puede cargar porque estos módulos están declarados explícitamente.

**Qué señalar en cada entrada:**

- `id`, `remoteEntry`, `ruta`, `version`;
- `eventosEmitidos`, `eventosEscuchados`;
- `estado` — destacar que Dashboard está `"inactivo"`: declarado en el contrato, pero aún no integrado en la plataforma en ejecución.

---

### Paso 4 — Carga dinámica dentro del shell

Desde la navbar del shell, navegar a:

- `/estudiantes`
- `/inscripciones`
- `/calificaciones`

**Qué decir:**

> Los mismos módulos que vimos de forma independiente ahora se cargan dentro del shell mediante Module Federation, cada uno desde su propio `remoteEntry.js`.

**Qué mostrar:**

- Carga correcta de cada módulo.
- Entradas `modulo.cargado` en la consola arquitectónica.

---

### Paso 5 — Comunicación desacoplada

1. Ir a **Estudiantes** en el shell.
2. Seleccionar **Carlos Eduardo Flores** (id 2).
3. Ir a **Inscripciones** — debe mostrar materias de Carlos.
4. Ir a **Calificaciones** — debe mostrar calificaciones de Carlos.

**Qué decir:**

> Cuando selecciono un estudiante, Estudiantes emite el evento `estudiante.seleccionado`. Inscripciones y Calificaciones escuchan ese evento. Lo importante es que Estudiantes no llama directamente a estos módulos. Los microfrontends colaboran mediante eventos, no mediante dependencias directas.

**Evidencia:** consola con `estudiante.seleccionado` en dirección `emitido` y `recibido`.

---

### Paso 6 — Consola arquitectónica

Señalar el panel inferior fijo.

**Qué decir:**

> Esta consola registra eventos emitidos, eventos recibidos y errores de integración. No es funcionalidad de negocio; es evidencia observable para la evaluación arquitectónica. Permite observar la comunicación desacoplada y el control de integración definidos en el marco.

---

### Paso 7 — Falla controlada

1. Entrar a **Calificaciones** — funciona normal.
2. Apagar el servidor de `mf-calificaciones` (Ctrl+C en su terminal).
3. Esperar unos segundos — punto rojo (offline) en la navbar.
4. Intentar entrar de nuevo a Calificaciones.

**Qué decir:**

> El microfrontend de Calificaciones no está disponible. El shell detecta la falla y evita que toda la plataforma se rompa. La falla de un módulo remoto no compromete toda la plataforma.

**Qué mostrar:**

- Pantalla **Módulo no disponible**.
- Consola con `modulo.error` o `modulo.desconectado`.
- **Estudiantes** e **Inscripciones** siguen funcionando.

> Este es probablemente el momento más fuerte de la demo.

---

### Paso 8 — Recuperación del módulo

1. Volver a levantar Calificaciones: `cd mf-calificaciones && npm start`.
2. Pulsar **Reconectar** en la pantalla de error, o navegar de nuevo a Calificaciones.

**Qué decir:**

> Cuando el remoto vuelve a estar disponible, el shell puede volver a cargarlo. Esto demuestra recuperación y control de integración.

---

### Paso 9 — Evolución con Dashboard

**Qué decir antes de actuar:**

> Hasta este momento la plataforma ha trabajado con tres microfrontends integrados. Dashboard está declarado en el manifiesto, pero con estado inactivo. Ahora se incorporará como módulo adicional.

**Acciones en vivo:**

1. En `shell/src/assets/manifest.json`, cambiar Dashboard de `"inactivo"` a `"activo"`.
2. Levantar el remoto: `cd mf-dashboard && npm start` (4204).
3. **F5** en el shell (`http://localhost:4200`).
4. Verificar que **Dashboard aparece en la navbar**.
5. Entrar a `/dashboard`.

**Qué decir:**

> Dashboard se incorpora como un nuevo microfrontend remoto. No fue necesario modificar Estudiantes, Inscripciones ni Calificaciones. Esto demuestra la capacidad de evolución controlada de la arquitectura.

**Evidencia:** aparición del cuarto enlace en navbar + `modulo.cargado` en consola.

> Presentar Dashboard como extensión arquitectónica, no como pantalla estadística.

---

### Paso 10 — Cierre

**Qué decir:**

> Con esta demostración se observa que el prototipo no es una plataforma académica tradicional, sino una aplicación web componible. Primero se evidenció que los módulos pueden existir de forma independiente; luego, que el shell los integra dinámicamente; después, que se comunican mediante eventos desacoplados; también se mostró que la caída de un módulo no rompe toda la plataforma; y finalmente, que se puede incorporar un nuevo módulo sin alterar los existentes.

> Estos escenarios corresponden a los criterios de evaluación del marco: independencia modular, contratos explícitos, integración controlada, comunicación desacoplada y capacidad de evolución.

---

## 4. Relación entre pasos y criterios de evaluación

| Criterio | Pasos que lo evidencian | Evidencia principal |
| --- | --- | --- |
| C1: Independencia modular | 1, 7 | Aplicaciones en puertos separados; falla aislada |
| C2: Claridad del contrato | 3, 5, 9 | Manifiesto con rutas, versiones, eventos y estados |
| C3: Control de integración | 2, 4, 7, 8, 9 | Shell como orquestador; carga dinámica; error y recuperación |
| C4: Desacoplamiento en comunicación | 5, 6 | EventBus; consola con emitido/recibido |
| C5: Capacidad de evolución | 7, 9 | Módulo caído controlado; activación de Dashboard en manifest |

---

## 5. Relación con el Capítulo IV

| Sección del Capítulo IV | Pasos relacionados | Uso dentro del capítulo |
| --- | --- | --- |
| 4.2 Descripción del prototipo | 1, 2, 4 | Estructura shell + microfrontends |
| 4.3 Aplicación del marco | 1–9 | Decisiones arquitectónicas derivadas del marco |
| 4.4 Evidencia arquitectónica | 5, 6, 7 | Consola, eventos, fallos controlados |
| 4.5 Evaluación mediante rúbrica | 1–9 | C1–C5 |
| 4.6 Discusión de resultados | 7, 9 | Estabilidad, extensibilidad, límites |
| 4.7 Síntesis del capítulo | 10 | Conclusión del marco materializado |

---

## 6. Recomendaciones para que la demo sea notoria

### Evitar presentar la demo como funcionalidades pequeñas

No conviene decir:

> Este módulo muestra estudiantes, este muestra materias y este muestra notas.

Conviene decir:

> Estos módulos representan unidades funcionales independientes que son integradas dinámicamente por un shell y coordinadas mediante contratos y eventos.

### Mostrar evidencia arquitectónica visible

Cada paso debe apoyarse en elementos observables:

- manifest (incluido Dashboard `inactivo` → `activo`);
- consola arquitectónica;
- navegación modular (3 → 4 módulos);
- estados online/offline;
- eventos emitidos y recibidos;
- carga desde `remoteEntry.js`;
- fallo controlado y recuperación.

### Dar protagonismo al fallo controlado

El paso 7 debe destacarse porque evidencia de forma visible que la arquitectura no se comporta como una aplicación monolítica.

### Presentar Dashboard como extensión arquitectónica

Dashboard no debe presentarse principalmente como resumen estadístico. Debe presentarse como evidencia de que la arquitectura puede crecer mediante nuevos módulos activados en el contrato del manifiesto.

---

## 7. Checklist pre-sustentación

- [ ] `mf-estudiantes`, `mf-inscripciones`, `mf-calificaciones` y `shell` en ejecución.
- [ ] `mf-dashboard` **apagado** al inicio.
- [ ] Dashboard con `"estado": "inactivo"` en `manifest.json`.
- [ ] Navbar del shell muestra **3** módulos con punto verde.
- [ ] Pestaña con `manifest.json` preparada.
- [ ] Consola arquitectónica visible.
- [ ] Ensayado: evento `estudiante.seleccionado` con Carlos (id 2).
- [ ] Ensayado: apagar/reconectar Calificaciones (pasos 7–8).
- [ ] Ensayado: activar Dashboard en manifest + F5 (paso 9).
- [ ] Tras ensayos, restaurar manifest a `"inactivo"` si la sustentación aún no es hoy.

---

## 8. Después de la demo

Para desarrollo cotidiano, se puede dejar Dashboard en `"activo"` y levantar los cinco servicios. Ese estado no es el de la sustentación, pero es válido para trabajo diario.

---

## 9. Anexo: UI y modo independiente (no arquitectura core)

Las mejoras de interfaz (filtros en Estudiantes, calendario en Inscripciones, gráficos en Calificaciones, KPIs en Dashboard) **no modifican** el marco arquitectónico: eventos, manifest, shell y Module Federation permanecen iguales.

Sirven para:

- reforzar la **delimitación modular** (cada MF se percibe como unidad completa);
- permitir **demostración standalone** en puertos `4201`–`4204` con estilos unificados (`shared/styles/_pam-base.scss`);
- ofrecer **demo local** en Inscripciones/Calificaciones cuando no hay EventBus (perfil Ana Lucía, sin emitir eventos).

En la narrativa de tesis, conviene presentar la UI enriquecida como consecuencia de la independencia de cada módulo, no como funcionalidad académica del sistema.
