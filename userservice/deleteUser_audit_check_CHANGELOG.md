# Changelog: deleteUser now checks AuditProcess assignment before deleting a user

## Context
- Service: userservice
- File: UserService.java
- Related microservice: auditprocessservice

## Summary of changes

### 1. Seguridad en la eliminación de usuarios
- El método `deleteUser` ahora realiza una petición HTTP al endpoint `/api/auditProcesses/isUserAssignedAsAuditor?userId=...` del microservicio de auditoría antes de eliminar un usuario.
- Si el usuario está asignado como auditor interno o externo en algún proceso de auditoría, la eliminación es bloqueada y se lanza una excepción `BadRequestException` con un mensaje claro.
- Si el usuario no está asignado a ninguna auditoría, la eliminación procede normalmente.

### 2. Detalles técnicos
- Se utiliza `RestTemplate` para la llamada HTTP.
- La URL del API Gateway se toma de la variable `apiUrl` (actualmente `http://host.docker.internal:8090`).
- El método espera una respuesta tipo `{ data: boolean }` y actúa en consecuencia.
- Si ocurre un error en la consulta al microservicio de auditoría, se lanza una excepción para evitar inconsistencias.

### 3. Motivo
- Evitar inconsistencias referenciales y errores de negocio al eliminar usuarios que aún están activos como auditores en procesos de auditoría.
- Cumplir con la lógica de negocio y la integridad de los datos entre microservicios.

---

**Esta mejora fue implementada en respuesta a la necesidad de proteger la integridad de los procesos de auditoría y evitar la eliminación accidental de usuarios críticos.**
