DROP DATABASE FindUsDB;
CREATE DATABASE FindUsDB;
USE FindUsDB;

CREATE TABLE Estado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombreEstado NVARCHAR(255),
    tipoEstado NVARCHAR(255),
    fechaCreacion DATETIME
);

CREATE TABLE TipoFotoPublicacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombreTipoFotoPublicacion NVARCHAR(255),
    fechaCreacion DATETIME
);

CREATE TABLE Rol (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombreRol NVARCHAR(255),
    fechaCreacion DATETIME
);

CREATE TABLE TipoDocumento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombreTipoDocumento NVARCHAR(255),
    fechaCreacion DATETIME
);

CREATE TABLE CategoriaMaterial (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombreCategoriaMaterial NVARCHAR(255),
    fechaCreacion DATETIME
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
    fechaCreacion DATETIME,
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
    fechaCreacion DATETIME,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (IdTipoDocumento) REFERENCES TipoDocumento(id),
    FOREIGN KEY (idEstado) REFERENCES Estado(id)
);

CREATE TABLE Comentario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    idPublicacion INT,
    texto NVARCHAR(255),
    fechaCreacion DATETIME,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (idPublicacion) REFERENCES Publicacion(id)
);

CREATE TABLE ChatPublicacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    idPublicacion INT,
    texto NVARCHAR(255),
    fechaCreacion DATETIME,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (idPublicacion) REFERENCES Publicacion(id)
);

CREATE TABLE RecursoEducativo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    idCategoriaMaterial INT,
    nombre NVARCHAR(255),
    descripcion NVARCHAR(255),
    urlMaterial NVARCHAR(255),
    fechaCreacion DATETIME,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (idCategoriaMaterial) REFERENCES CategoriaMaterial(id)
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
    fechaCreacion DATETIME,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (idPublicacion) REFERENCES Publicacion(id),
    FOREIGN KEY (IdEstatus) REFERENCES Estado(id)
);

CREATE TABLE FotosAvistamiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    urlArchivo NVARCHAR(255),
    IdAvistamiento INT,
    fechaCreacion DATETIME,
    FOREIGN KEY (IdAvistamiento) REFERENCES Avistamiento(id)
);

CREATE TABLE FotosPublicacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    urlArchivo NVARCHAR(255),
    IdTipoFotoPublicacion INT,
    IdPublicacion INT,
    fechaCreacion DATETIME,
    FOREIGN KEY (IdTipoFotoPublicacion) REFERENCES TipoFotoPublicacion(id),
    FOREIGN KEY (IdPublicacion) REFERENCES Publicacion(id)
);

CREATE TABLE CambiarContrasena (
    id INT AUTO_INCREMENT PRIMARY KEY,
    IdUsuario INT,
    codigoVerificacion NVARCHAR(255),
    IdEstatus INT,
    fechaCreacion DATETIME,
    fechaExpiracionCodigo DATETIME,
    vigente BIT,
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(id),
    FOREIGN KEY (IdEstatus) REFERENCES Estado(id)
);