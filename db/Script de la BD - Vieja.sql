DROP DATABASE FindUsDB;
CREATE DATABASE FindUsDB;
USE FindUsDB;

CREATE TABLE Estado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombreEstado NVARCHAR(255),
    tipoEstado NVARCHAR(255),
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE TipoFotoPublicacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombreTipoFotoPublicacion NVARCHAR(255),
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Rol (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombreRol NVARCHAR(255),
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE TipoDocumento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombreTipoDocumento NVARCHAR(255),
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE CategoriaMaterial (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombreCategoriaMaterial NVARCHAR(255),
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre NVARCHAR(255),
    apellido NVARCHAR(255),
    email NVARCHAR(255),
    hash_contrasena NVARCHAR(255),
    fechaNacimiento DATETIME,
    numeroTelefono NVARCHAR(255),
    urlFotoPerfil NVARCHAR(255),
    Verificado BOOLEAN,
    codigoVerificacionUsuario NVARCHAR(255),
    IdTipoDocumento INT,
    numeroDocumento NVARCHAR(255),
    idRol INT,
    idEstado INT,
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdTipoDocumento) REFERENCES TipoDocumento(id),
    FOREIGN KEY (idRol) REFERENCES Rol(id),
    FOREIGN KEY (idEstado) REFERENCES Estado(id)
);

CREATE TABLE Publicacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    nombreDesaparecido NVARCHAR(255),
    IdTipoDocumento INT,
    numeroDocumentoDesaparecido NVARCHAR(11),
    edad INT,
    telefono NVARCHAR(10),
    fechaDesaparicion DATETIME,
    descripcionPersonaDesaparecido NVARCHAR(255),
    relacionUsuarioConDesaparecido NVARCHAR(255),
    informacionContacto NVARCHAR(255),
    ubicacion_desaparicion POINT,
    Verificado BOOLEAN,
    idEstado INT,
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (IdTipoDocumento) REFERENCES TipoDocumento(id),
    FOREIGN KEY (idEstado) REFERENCES Estado(id)
);

CREATE TABLE Comentario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    idPublicacion INT,
    texto NVARCHAR(255),
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (idPublicacion) REFERENCES Publicacion(id)
);

CREATE TABLE ChatPublicacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    idPublicacion INT,
    texto NVARCHAR(255),
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (idPublicacion) REFERENCES Publicacion(id)
);

CREATE TABLE RecursoEducativo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    idCategoriaMaterial INT,
    nombre NVARCHAR(255),
    descripcion NVARCHAR(255),
    idEstado INT,
    urlMaterial NVARCHAR(255),
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (idCategoriaMaterial) REFERENCES CategoriaMaterial(id),
    FOREIGN KEY (idEstado) REFERENCES Estado(id)
);

CREATE TABLE Avistamiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    idPublicacion INT,
    ubicacion POINT,
    fechaHora DATETIME,
    detalles NVARCHAR(255),
    Verificado BOOLEAN,
    IdEstatus INT,
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (idPublicacion) REFERENCES Publicacion(id),
    FOREIGN KEY (IdEstatus) REFERENCES Estado(id)
);

CREATE TABLE FotosAvistamiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    urlArchivo NVARCHAR(255),
    IdAvistamiento INT,
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdAvistamiento) REFERENCES Avistamiento(id)
);

CREATE TABLE FotosPublicacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    urlArchivo NVARCHAR(255),
    IdTipoFotoPublicacion INT,
    IdPublicacion INT,
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdTipoFotoPublicacion) REFERENCES TipoFotoPublicacion(id),
    FOREIGN KEY (IdPublicacion) REFERENCES Publicacion(id)
);

CREATE TABLE CambiarContrasena (
    id INT AUTO_INCREMENT PRIMARY KEY,
    IdUsuario INT,
    codigoVerificacion NVARCHAR(255),
    IdEstatus INT,
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechaExpiracionCodigo DATETIME,
    vigente BIT,
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (IdEstatus) REFERENCES Estado(id)
);

CREATE TABLE IdiomaAplicacion(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombreIdioma NVARCHAR(255),
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

#Insertar datos de Tablas Catalogos
INSERT INTO Estado (nombreEstado, tipoEstado) VALUES ('Activo', 'General');
INSERT INTO Estado (nombreEstado, tipoEstado) VALUES ('Inactivo', 'General');

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

