DROP DATABASE IF EXISTS FindUsDB;
CREATE DATABASE FindUsDB;
\c FindUsDB;

CREATE TABLE Estado (
    id SERIAL PRIMARY KEY,
    nombreEstado VARCHAR(255),
    tipoEstado VARCHAR(255),
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE TipoFotoPublicacion (
    id SERIAL PRIMARY KEY,
    nombreTipoFotoPublicacion VARCHAR(255),
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Rol (
    id SERIAL PRIMARY KEY,
    nombreRol VARCHAR(255),
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE TipoDocumento (
    id SERIAL PRIMARY KEY,
    nombreTipoDocumento VARCHAR(255),
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE CategoriaMaterial (
    id SERIAL PRIMARY KEY,
    nombreCategoriaMaterial VARCHAR(255),
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Usuario (
    id SERIAL PRIMARY KEY,
    idAuthUsuario VARCHAR(255),
    nombre VARCHAR(255),
    apellido VARCHAR(255),
    email VARCHAR(255),
    fechaNacimiento TIMESTAMP,
    numeroTelefono VARCHAR(255),
    urlFotoPerfil VARCHAR(255),
    Verificado BOOLEAN,
    codigoVerificacionUsuario VARCHAR(255),
    IdTipoDocumento INT,
    numeroDocumento VARCHAR(255),
    idRol INT,
    idEstado INT,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdTipoDocumento) REFERENCES TipoDocumento(id),
    FOREIGN KEY (idRol) REFERENCES Rol(id),
    FOREIGN KEY (idEstado) REFERENCES Estado(id)
);

CREATE TABLE Publicacion (
    id SERIAL PRIMARY KEY,
    idUsuario INT,
    nombreDesaparecido VARCHAR(255),
    IdTipoDocumento INT,
    numeroDocumentoDesaparecido VARCHAR(11),
    edad INT,
    telefono VARCHAR(10),
    fechaDesaparicion TIMESTAMP,
    descripcionPersonaDesaparecido VARCHAR(255),
    relacionUsuarioConDesaparecido VARCHAR(255),
    informacionContacto VARCHAR(255),
    ubicación_desaparicion_latitud VARCHAR(255),
    ubicación_desaparicion_longitud VARCHAR(255),
    Verificado BOOLEAN,
    idEstado INT,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (IdTipoDocumento) REFERENCES TipoDocumento(id),
    FOREIGN KEY (idEstado) REFERENCES Estado(id)
);

CREATE TABLE Comentario (
    id SERIAL PRIMARY KEY,
    idUsuario INT,
    idPublicacion INT,
    texto VARCHAR(255),
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (idPublicacion) REFERENCES Publicacion(id)
);

CREATE TABLE ChatPublicacion (
    id SERIAL PRIMARY KEY,
    idUsuario INT,
    idPublicacion INT,
    texto VARCHAR(255),
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (idPublicacion) REFERENCES Publicacion(id)
);

CREATE TABLE RecursoEducativo (
    id SERIAL PRIMARY KEY,
    idUsuario INT,
    idCategoriaMaterial INT,
    nombre VARCHAR(255),
    descripcion VARCHAR(255),
    idEstado INT,
    urlMaterial VARCHAR(255),
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (idCategoriaMaterial) REFERENCES CategoriaMaterial(id),
    FOREIGN KEY (idEstado) REFERENCES Estado(id)
);

CREATE TABLE Avistamiento (
    id SERIAL PRIMARY KEY,
    idUsuario INT,
    idPublicacion INT,
    ubicacion POINT,
    fechaHora TIMESTAMP,
    detalles VARCHAR(255),
    Verificado BOOLEAN,
    IdEstatus INT,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (idPublicacion) REFERENCES Publicacion(id),
    FOREIGN KEY (IdEstatus) REFERENCES Estado(id)
);

CREATE TABLE FotosAvistamiento (
    id SERIAL PRIMARY KEY,
    urlArchivo VARCHAR(255),
    IdAvistamiento INT,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdAvistamiento) REFERENCES Avistamiento(id)
);

CREATE TABLE FotosPublicacion (
    id SERIAL PRIMARY KEY,
    urlArchivo VARCHAR(255),
    IdTipoFotoPublicacion INT,
    IdPublicacion INT,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdTipoFotoPublicacion) REFERENCES TipoFotoPublicacion(id),
    FOREIGN KEY (IdPublicacion) REFERENCES Publicacion(id)
);

CREATE TABLE CambiarContrasena (
    id SERIAL PRIMARY KEY,
    IdUsuario INT,
    IdEstatus INT,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaExpiracionCodigo TIMESTAMP,
    vigente BOOLEAN,
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (IdEstatus) REFERENCES Estado(id)
);

CREATE TABLE IdiomaAplicacion(
    id SERIAL PRIMARY KEY,
    nombreIdioma VARCHAR(255),
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Reporte (
    id SERIAL PRIMARY KEY,
    reportes_activos INT NOT NULL DEFAULT 0,
    nuevos_reportes INT NOT NULL DEFAULT 0,
    reportes_resueltos INT NOT NULL DEFAULT 0,
    avistamientos_activos INT NOT NULL DEFAULT 0,
    total_usuarios_activos INT NOT NULL DEFAULT 0,
    dia_inicio_conteo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dia_fin_conteo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE UBICACION_USUARIO (
    id SERIAL PRIMARY KEY,
    idUsuario INT,
    ubicacion_latitud VARCHAR(255),
    ubicacion_longitud VARCHAR(255),
    fechaHoraActualizacion TIMESTAMP,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id)
);


-- Insertar datos en las tablas de catálogo
INSERT INTO Estado (nombreEstado, tipoEstado) VALUES ('Activo', 'General');
INSERT INTO Estado (nombreEstado, tipoEstado) VALUES ('Inactivo', 'General');
INSERT INTO Estado (nombreEstado, tipoEstado) VALUES ('Vencido', 'Cambio de Contraseña');

INSERT INTO TipoFotoPublicacion (nombreTipoFotoPublicacion) VALUES ('Foto Desaparecido');
INSERT INTO TipoFotoPublicacion (nombreTipoFotoPublicacion) VALUES ('Foto Reporte Policial');

INSERT INTO Rol (nombreRol) VALUES ('Usuario');
INSERT INTO Rol (nombreRol) VALUES ('Moderador');
INSERT INTO Rol (nombreRol) VALUES ('Administrador');
INSERT INTO Rol (nombreRol) VALUES ('Servicio de Emergencia');

INSERT INTO TipoDocumento (nombreTipoDocumento) VALUES ('Cedula');
INSERT INTO TipoDocumento (nombreTipoDocumento) VALUES ('Pasaporte');

INSERT INTO CategoriaMaterial (nombreCategoriaMaterial) VALUES ('PDF');
INSERT INTO CategoriaMaterial (nombreCategoriaMaterial) VALUES ('Link a Video');
INSERT INTO CategoriaMaterial (nombreCategoriaMaterial) VALUES ('Imagen');
INSERT INTO CategoriaMaterial (nombreCategoriaMaterial) VALUES ('Link a Pagina Web');

INSERT INTO IdiomaAplicacion (nombreIdioma) VALUES ('Español');
INSERT INTO IdiomaAplicacion (nombreIdioma) VALUES ('Ingles');
