SELECT * FROM usuarios

SELECT * FROM usuarios WHERE id = 2

SELECT * FROM necessidades

SELECT 
    n.id AS necessidade_id,
    c.nome AS centro_distribuicao_nome, 
    cat.nome AS categorias,
    n.item_nome,
    n.quantidade_atual,
    n.quantidade_objetivo,
	 -- Usamos ::DECIMAL para garantir que o resultado não seja zero e ROUND para ficar bonito
    ROUND((n.quantidade_atual::DECIMAL / n.quantidade_objetivo::DECIMAL) * 100, 2)
	AS porcentagem_concluida,
    n.prioridade   
FROM necessidades n
JOIN centros_distribuicao c ON n.centro_id = c.id
JOIN categorias cat ON n.categoria_id = cat.id
ORDER BY 
    CASE n.prioridade 
        WHEN 'CRITICA' THEN 1 
        WHEN 'ALTA' THEN 2 
        WHEN 'MEDIA' THEN 3 
        WHEN 'BAIXA' THEN 4 
    END;
	
SELECT 
    rd.id AS registro_id,
    u.nome AS doador,  
  n.item_nome, 
rd.item_avulso_nome AS item_doado, 
    rd.quantidade_doada,
    rd.data_intencao,
    rd.status
FROM registro_doacoes rd
JOIN usuarios u ON rd.usuario_id = u.id
-- Aqui você deve usar o nome exato da sua tabela de necessidades
LEFT JOIN necessidades n ON rd.necessidade_id = n.id 
WHERE rd.status = 'PENDENTE'
ORDER BY rd.data_intencao DESC;

SELECT 
    n.id AS necessidade_id,
    c.nome AS centro_distribuicao_nome, 
    cat.nome AS categorias,
    n.item_nome,
    n.quantidade_atual,
    n.quantidade_objetivo,
    n.status,
    ROUND((n.quantidade_atual::DECIMAL / n.quantidade_objetivo::DECIMAL) * 100, 2) AS porcentagem_concluida,
    n.prioridade   
FROM necessidades n
JOIN centros_distribuicao c ON n.centro_id = c.id
JOIN categorias cat ON n.categoria_id = cat.id
ORDER BY 
    -- 1º CRITÉRIO: Status (Garante que ATIVO fique acima de CONCLUIDO)
    CASE 
        WHEN n.status = 'ATIVO' THEN 1 
        ELSE 2 
    END ASC,
    
    -- 2º CRITÉRIO: Prioridade (Ordena dentro de cada grupo de status)
    CASE n.prioridade 
        WHEN 'CRITICA' THEN 1 
        WHEN 'ALTA'    THEN 2 
        WHEN 'MEDIA'   THEN 3 
        WHEN 'BAIXA'   THEN 4 
        ELSE 5
    END ASC,
    
    n.item_nome ASC;
