CREATE OR REPLACE FUNCTION llenar_tabla_reporte()
RETURNS void AS $$
BEGIN 
    -- Desactivar el registro anterior (poner activo = FALSE)
    UPDATE reporte
    SET activo = FALSE
    WHERE activo = TRUE;

    INSERT INTO estadisticas_semanales (
        reportes_activos,
        nuevos_reportes,
        reportes_resueltos,
        avistamientos_activos,
        total_usuarios_activos,
        total_usuarios_nuevos,
        created_at,
        dia_inicio_conteo,
        dia_fin_conteo,
        activo
    )
    VALUES (
        -- reportes_activos: conteo de reportes con idestado = 1
        (SELECT COUNT(*) FROM publicacion WHERE idestado = 1),
        
        -- nuevos_reportes: reportes creados en la última semana
        (SELECT COUNT(*) FROM publicacion WHERE fechacreacion >= NOW() - INTERVAL '7 days'),
        
        -- reportes_resueltos: reportes con estado = 4
        (SELECT COUNT(*) FROM publicacion WHERE idestado = 4),
        
        -- avistamientos_activos: conteo de avistamientos con estado = 1
        (SELECT COUNT(*) FROM avistamiento WHERE idestado = 1),
        
        -- total_usuarios_activos: usuarios con estado = 1
        (SELECT COUNT(*) FROM usuarios WHERE idestado = 1),
        
        -- total_usuarios_nuevos: usuarios creados en la última semana
        (SELECT COUNT(*) FROM usuarios WHERE fechacreacion >= NOW() - INTERVAL '7 days'),
        
        -- created_at: Fecha y hora actual
        NOW(),
        
        -- dia_inicio_conteo: Inicio de la semana
        DATE_TRUNC('week', NOW()),
        
        -- dia_fin_conteo: Fin de la semana
        DATE_TRUNC('week', NOW()) + INTERVAL '6 days',
        
        -- activo: siempre activo (TRUE)
        TRUE
    );
END;
$$ LANGUAGE plpgsql;