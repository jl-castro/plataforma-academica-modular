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

## 2. Orden recomendado de la demo

El orden propuesto para la demostración es el siguiente:

| Orden | Escenario | Mensaje principal |
| --- | --- | --- |
| 1 | Composición modular de la plataforma | La aplicación se arma a partir de módulos independientes |
| 2 | Comunicación desacoplada por eventos | Los módulos colaboran sin depender directamente entre sí |
| 3 | Falla controlada de un módulo remoto | Un módulo puede fallar sin afectar toda la plataforma |
| 4 | Incorporación de un nuevo módulo | La arquitectura puede crecer de forma controlada |

Este orden permite construir una narrativa progresiva:

1. Primero se comprende la estructura general.
2. Luego se observa la interacción entre módulos.
3. Después se demuestra aislamiento frente a fallos.
4. Finalmente se evidencia la capacidad de evolución del sistema.

---

# Escenario 1: Composición modular de la plataforma

## Propósito

Demostrar que la Plataforma Académica Modular no está construida como una aplicación monolítica, sino como una aplicación componible formada por un shell principal y varios microfrontends independientes.

Este escenario introduce la idea central de la tesis: el sistema se estructura mediante módulos funcionales autónomos que son integrados dinámicamente por un componente orquestador.

## Qué se debe mostrar

- El shell como punto de entrada de la plataforma.
- La navegación principal generada a partir de los módulos disponibles.
- Los microfrontends independientes:
  - Estudiantes;
  - Inscripciones;
  - Calificaciones;
  - Dashboard.
- El manifiesto de módulos como contrato de integración.
- La consola arquitectónica como mecanismo de observabilidad.
- La carga de módulos desde el shell.

## Pasos de demostración

1. Abrir la plataforma desde el shell.
2. Mostrar que el shell contiene la estructura general de navegación.
3. Explicar que el shell no contiene lógica funcional académica.
4. Mostrar los módulos disponibles en la navegación.
5. Abrir el manifiesto de módulos.
6. Señalar que cada módulo declara su ruta, versión, punto de entrada, eventos y estado.
7. Navegar hacia el módulo Estudiantes.
8. Navegar hacia Inscripciones.
9. Navegar hacia Calificaciones.
10. Navegar hacia Dashboard (activo en el manifest; requiere `mf-dashboard` en `4204`).
11. Mostrar en la consola arquitectónica los registros de carga o actividad.

**Opcional (modo independiente):** abrir un MF en su puerto (`4201`–`4204`) para mostrar que cada unidad puede ejecutarse y presentarse como producto autónomo, con estilos compartidos desde `shared/styles/`. Inscripciones y Calificaciones muestran demo local si no hay evento del shell.

## Mensaje que debe comunicarse

La plataforma no está compuesta por pantallas internas de una única aplicación, sino por módulos independientes que son reconocidos, registrados y cargados por el shell. El shell actúa como orquestador de composición y no como contenedor de lógica de negocio.

## Parte de la tesis que se demuestra

Este escenario evidencia principalmente la aplicación de los siguientes elementos del marco:

| Elemento del marco | Evidencia en la demo |
| --- | --- |
| P1: Independencia modular | Cada microfrontend representa un dominio funcional separado |
| P3: Integración controlada | El shell gestiona la composición de los módulos |
| C1: Independencia modular | Los módulos están delimitados por responsabilidad funcional |
| C3: Control de integración | La carga se realiza desde el shell y no por dependencias directas |
| L1: Definir límites claros de cada módulo | Cada módulo tiene responsabilidad explícita |
| L3: Utilizar un mecanismo centralizado de integración | El shell funciona como orquestador |

## Evidencia generada

- Navegación entre microfrontends.
- Manifiesto de módulos.
- Consola arquitectónica.
- Estructura separada del shell y los microfrontends.
- Carga de módulos desde rutas independientes.

## Relación con el Capítulo IV

Este escenario corresponde a la sección de descripción del prototipo y arquitectura general. Permite justificar que la Plataforma Académica Modular es un escenario válido para aplicar el marco, porque presenta una estructura compuesta por un shell y módulos independientes.

También sirve como evidencia para la sección de delimitación modular, ya que permite observar que cada módulo tiene una responsabilidad funcional definida.

---

# Escenario 2: Comunicación desacoplada por eventos

## Propósito

Demostrar que los microfrontends pueden coordinarse sin mantener referencias directas entre ellos, utilizando un mecanismo centralizado de comunicación basado en eventos.

Este escenario permite mostrar que la independencia modular no impide la colaboración entre componentes. Los módulos pueden interactuar, pero lo hacen mediante un contrato de comunicación explícito y desacoplado.

## Qué se debe mostrar

- El módulo Estudiantes emitiendo el evento `estudiante.seleccionado`.
- Los módulos Inscripciones y Calificaciones reaccionando a ese evento.
- La consola arquitectónica registrando el evento emitido y recibido.
- La ausencia de comunicación directa entre microfrontends.
- El bus de eventos centralizado provisto por el shell.

## Pasos de demostración

1. Abrir el módulo Estudiantes.
2. Seleccionar un estudiante.
3. Mostrar que se emite el evento `estudiante.seleccionado`.
4. Mostrar la consola arquitectónica con el evento registrado.
5. Abrir el módulo Inscripciones.
6. Verificar que muestra las materias asociadas al estudiante seleccionado.
7. Abrir el módulo Calificaciones.
8. Verificar que muestra las calificaciones asociadas al mismo estudiante.
9. Explicar que Estudiantes no conoce internamente a Inscripciones ni a Calificaciones.
10. Mostrar que la relación entre módulos está mediada por el bus de eventos.

## Mensaje que debe comunicarse

El módulo Estudiantes no llama directamente a Inscripciones ni a Calificaciones. Solo publica un evento. Los otros módulos reaccionan a ese evento porque escuchan el canal definido en el contrato de comunicación. Esto demuestra que la colaboración entre módulos ocurre sin acoplamiento directo.

## Parte de la tesis que se demuestra

Este escenario evidencia principalmente la aplicación de los siguientes elementos del marco:

| Elemento del marco | Evidencia en la demo |
| --- | --- |
| P2: Contratos explícitos | El evento está declarado como parte del contrato del módulo |
| P4: Comunicación desacoplada | Los módulos se comunican mediante eventos, no por referencias directas |
| C2: Claridad del contrato | El manifiesto declara eventos emitidos y escuchados |
| C4: Desacoplamiento en comunicación | La interacción ocurre mediante el bus de eventos |
| L2: Establecer contratos explícitos entre módulos | Los eventos forman parte del contrato de integración |
| L4: Evitar comunicación directa entre módulos | Ningún módulo invoca directamente a otro |

## Evidencia generada

- Evento `estudiante.seleccionado` emitido desde Estudiantes.
- Respuesta de Inscripciones al evento.
- Respuesta de Calificaciones al evento.
- Registro de eventos en la consola arquitectónica.
- Declaración de eventos en el manifiesto de módulos.

## Relación con el Capítulo IV

Este escenario corresponde a la sección de comunicación desacoplada. Permite demostrar que el bus de eventos funciona como mecanismo centralizado de interacción y que los módulos mantienen independencia estructural.

También aporta evidencia para la rúbrica, especialmente en el criterio C4, porque permite observar si la comunicación ocurre exclusivamente mediante el mecanismo definido por el marco.

---

# Escenario 3: Falla controlada de un módulo remoto

## Propósito

Demostrar que la arquitectura puede aislar la falla de un microfrontend sin comprometer el funcionamiento general de la plataforma.

Este escenario es uno de los más importantes de la demo porque evidencia que la independencia modular no es solo una división estructural, sino que tiene consecuencias observables en la estabilidad del sistema.

## Qué se debe mostrar

- Un microfrontend funcionando normalmente.
- La simulación de caída de ese microfrontend.
- El shell detectando que el remoto no está disponible.
- Una pantalla o mensaje de error controlado.
- La consola arquitectónica registrando el fallo.
- Los demás módulos funcionando sin interrupción.
- Opcionalmente, la recuperación del módulo cuando vuelve a estar disponible.

## Pasos de demostración

1. Iniciar la plataforma con todos los módulos activos.
2. Navegar hacia Calificaciones o Inscripciones para mostrar que el módulo funciona.
3. Apagar el servidor del microfrontend seleccionado.
4. Volver al shell.
5. Intentar ingresar nuevamente al módulo apagado.
6. Mostrar que el shell detecta que el módulo está offline.
7. Mostrar la pantalla de error o estado no disponible.
8. Mostrar en la consola arquitectónica el evento o registro de error.
9. Navegar hacia otros módulos, como Estudiantes o Dashboard.
10. Verificar que los otros módulos siguen funcionando.
11. Opcionalmente, volver a levantar el microfrontend apagado.
12. Mostrar que el shell puede reconocer nuevamente su disponibilidad.

## Mensaje que debe comunicarse

La caída de un módulo remoto no rompe toda la plataforma. El shell controla la integración, detecta la indisponibilidad del módulo y evita que el error afecte a los demás componentes. Esto demuestra aislamiento, control de integración y evolución controlada.

## Parte de la tesis que se demuestra

Este escenario evidencia principalmente la aplicación de los siguientes elementos del marco:

| Elemento del marco | Evidencia en la demo |
| --- | --- |
| P1: Independencia modular | La falla de un módulo no afecta directamente a los demás |
| P3: Integración controlada | El shell gestiona la disponibilidad y carga de módulos |
| P5: Evolución controlada | El sistema conserva estabilidad ante un módulo no disponible |
| C1: Independencia modular | Los módulos operan sin depender directamente del módulo caído |
| C3: Control de integración | El shell controla la carga y el error de integración |
| C5: Capacidad de evolución | La plataforma mantiene estabilidad ante cambios o fallos |
| L3: Utilizar un mecanismo centralizado de integración | El shell administra la situación de fallo |
| L5: Diseñar módulos reemplazables | El módulo puede caer o recuperarse sin alterar la estructura global |

## Evidencia generada

- Estado offline del módulo.
- Registro de error en la consola arquitectónica.
- Pantalla de error controlada.
- Funcionamiento continuo de los demás módulos.
- Recuperación del módulo, si se vuelve a levantar.

## Relación con el Capítulo IV

Este escenario corresponde a la evidencia arquitectónica y a la evaluación mediante rúbrica. Es especialmente útil para evaluar C3 y C5.

Permite demostrar que la integración dinámica no solo consiste en cargar módulos exitosamente, sino también en manejar de forma controlada la indisponibilidad de un módulo remoto.

Este escenario refuerza la discusión de resultados, porque muestra una ventaja arquitectónica visible frente a una estructura monolítica o fuertemente acoplada.

---

# Escenario 4: Incorporación de un nuevo módulo

## Propósito

Demostrar que la arquitectura permite incorporar un nuevo microfrontend sin modificar los módulos existentes.

Este escenario cierra la demo mostrando la capacidad de evolución de la plataforma. Después de evidenciar composición, comunicación y tolerancia al fallo, se demuestra que la arquitectura puede crecer mediante la incorporación controlada de nuevos módulos.

## Qué se debe mostrar

- El módulo Dashboard como módulo adicional.
- Su declaración en el manifiesto.
- Su ruta de integración.
- Su carga desde el shell.
- La ausencia de cambios en Estudiantes, Inscripciones y Calificaciones.
- La consola arquitectónica registrando su carga o disponibilidad.

## Pasos de demostración

1. Mostrar el manifiesto de módulos.
2. Identificar la entrada correspondiente al módulo Dashboard.
3. Verificar que Dashboard posee identificador, ruta, versión, punto de entrada, eventos y estado.
4. Activar Dashboard en el manifiesto, si se desea mostrar como módulo incorporado en tiempo de demo.
5. Levantar el microfrontend Dashboard.
6. Volver al shell.
7. Mostrar que Dashboard aparece como módulo disponible en la navegación.
8. Ingresar al módulo Dashboard.
9. Mostrar que se carga correctamente desde el shell.
10. Explicar que no fue necesario modificar los módulos Estudiantes, Inscripciones ni Calificaciones.

## Mensaje que debe comunicarse

La incorporación de Dashboard evidencia que la plataforma puede crecer mediante nuevos módulos sin alterar los microfrontends existentes. El shell reconoce el nuevo módulo a partir del contrato definido en el manifiesto y lo integra como parte de la plataforma.

## Parte de la tesis que se demuestra

Este escenario evidencia principalmente la aplicación de los siguientes elementos del marco:

| Elemento del marco | Evidencia en la demo |
| --- | --- |
| P2: Contratos explícitos | Dashboard se incorpora mediante una entrada declarada en el manifiesto |
| P3: Integración controlada | El shell carga Dashboard mediante el mecanismo de integración definido |
| P5: Evolución controlada | Se incorpora un nuevo módulo sin modificar los existentes |
| C2: Claridad del contrato | Dashboard declara su contrato de integración |
| C3: Control de integración | El shell gestiona su carga dinámica |
| C5: Capacidad de evolución | El sistema se extiende sin afectar módulos previos |
| L2: Establecer contratos explícitos entre módulos | Dashboard se declara formalmente antes de integrarse |
| L3: Utilizar un mecanismo centralizado de integración | El shell incorpora el módulo |
| L5: Diseñar módulos reemplazables | La arquitectura permite agregar o retirar módulos |

## Evidencia generada

- Entrada de Dashboard en el manifiesto.
- Dashboard visible en navegación, si está activo.
- Carga del módulo desde el shell.
- Registro en consola arquitectónica.
- Ausencia de modificaciones en los módulos existentes.

## Relación con el Capítulo IV

Este escenario corresponde directamente al criterio C5 de la rúbrica: capacidad de evolución.

La incorporación de Dashboard debe presentarse como evidencia de extensibilidad arquitectónica, no simplemente como una pantalla estadística. Lo importante no es la funcionalidad del Dashboard, sino el hecho de que puede integrarse como nuevo módulo dentro de la plataforma sin alterar los módulos existentes.

---

# 3. Relación general entre escenarios y criterios de evaluación

| Criterio | Escenario que lo evidencia | Evidencia principal |
| --- | --- | --- |
| C1: Independencia modular | Escenario 1 y Escenario 3 | Módulos separados, ejecución independiente y falla aislada |
| C2: Claridad del contrato | Escenario 1, Escenario 2 y Escenario 4 | Manifiesto con rutas, versiones, eventos y estados |
| C3: Control de integración | Escenario 1, Escenario 3 y Escenario 4 | Shell como orquestador de carga dinámica |
| C4: Desacoplamiento en comunicación | Escenario 2 | Bus de eventos y ausencia de referencias directas |
| C5: Capacidad de evolución | Escenario 3 y Escenario 4 | Módulo caído controlado e incorporación de Dashboard |

---

# 4. Relación general con el Capítulo IV

Los escenarios de demo deben alimentar directamente las siguientes secciones del Capítulo IV:

| Sección del Capítulo IV | Escenario relacionado | Uso dentro del capítulo |
| --- | --- | --- |
| 4.2 Descripción del prototipo | Escenario 1 | Presentar estructura general del shell y microfrontends |
| 4.3 Aplicación del marco | Escenarios 1, 2, 3 y 4 | Mostrar decisiones arquitectónicas derivadas del marco |
| 4.4 Evidencia arquitectónica | Escenarios 2 y 3 | Presentar consola, eventos, carga dinámica y fallos controlados |
| 4.5 Evaluación mediante rúbrica | Escenarios 1, 2, 3 y 4 | Evaluar C1, C2, C3, C4 y C5 |
| 4.6 Discusión de resultados | Escenarios 3 y 4 | Interpretar estabilidad, extensibilidad y límites de validación |
| 4.7 Síntesis del capítulo | Todos | Concluir que el marco permite estructurar una arquitectura coherente |

---

# 5. Narrativa sugerida para presentar la demo

La demostración puede introducirse de la siguiente manera:

> Esta demo no busca mostrar una plataforma académica completa, sino evidenciar cómo el marco de diseño arquitectónico se materializa en un prototipo funcional mínimo. La demostración se organiza en cuatro escenarios: primero, se muestra cómo la plataforma se compone mediante microfrontends independientes; segundo, cómo estos módulos se comunican mediante eventos sin acoplamiento directo; tercero, cómo la caída de un módulo remoto no afecta el funcionamiento global; y finalmente, cómo la arquitectura permite incorporar un nuevo módulo sin modificar los existentes.

---

# 6. Recomendaciones para que la demo sea notoria

## Evitar presentar la demo como funcionalidades pequeñas

No conviene decir:

> Este módulo muestra estudiantes, este muestra materias y este muestra notas.

Esa explicación reduce la demo a una aplicación común.

Conviene decir:

> Estos módulos representan unidades funcionales independientes que son integradas dinámicamente por un shell y coordinadas mediante contratos y eventos.

## Mostrar evidencia arquitectónica visible

Cada escenario debe apoyarse en elementos observables:

- manifest;
- consola arquitectónica;
- navegación modular;
- estados online/offline;
- eventos emitidos y recibidos;
- carga de microfrontends;
- incorporación de Dashboard;
- fallo controlado de un módulo.

## Dar protagonismo al fallo controlado

El escenario de falla controlada debe destacarse porque es el más notorio para un jurado. Permite mostrar de forma visible que la arquitectura no se comporta como una aplicación monolítica.

## Presentar Dashboard como extensión arquitectónica

Dashboard no debe presentarse principalmente como un resumen estadístico. Debe presentarse como evidencia de que la arquitectura puede crecer mediante nuevos módulos.

---

# 7. Estado esperado del prototipo antes de la demo

Antes de realizar la demostración, se recomienda verificar lo siguiente:

- El shell debe iniciar correctamente.
- Estudiantes debe estar activo.
- Inscripciones debe estar activo.
- Calificaciones debe estar activo.
- Dashboard debe estar activo y el remoto en `4204` online si se usará en la navegación del shell.
- El manifiesto debe estar sincronizado con las rutas y puertos reales.
- La consola arquitectónica debe mostrar eventos y errores.
- El bus de eventos debe registrar `estudiante.seleccionado`.
- Debe existir una pantalla o respuesta controlada para módulos offline.
- Debe probarse previamente la caída y recuperación de un módulo remoto.

---

# 8. Conclusión

Los cuatro escenarios definidos permiten demostrar de manera clara y notoria que el prototipo está alineado con el marco de diseño arquitectónico propuesto en la tesis.

La demo no debe centrarse en la funcionalidad académica, sino en la evidencia de que la arquitectura resultante es modular, componible, integrable dinámicamente, comunicada de forma desacoplada y capaz de evolucionar sin afectar la estabilidad global del sistema.

El orden recomendado es:

1. Composición modular.
2. Comunicación por eventos.
3. Falla controlada.
4. Incorporación de Dashboard.

---

# 9. Anexo: UI y modo independiente (no arquitectura core)

Las mejoras recientes de interfaz (filtros en Estudiantes, calendario y créditos en Inscripciones, gráficos en Calificaciones, KPIs en Dashboard) **no modifican** el marco arquitectónico: eventos, manifest, shell y Module Federation permanecen iguales.

Sirven para:

- reforzar la **delimitación modular** (cada MF se percibe como unidad completa);
- permitir **demostración standalone** en puertos `4201`–`4204` con estilos unificados (`shared/styles/_pam-base.scss`);
- ofrecer **demo local** en Inscripciones/Calificaciones cuando no hay EventBus (perfil Ana Lucía, sin emitir eventos).

En la narrativa de tesis, conviene presentar la UI enriquecida como consecuencia de la independencia de cada módulo, no como funcionalidad académica del sistema.
