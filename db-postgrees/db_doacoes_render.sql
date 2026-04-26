-- Criação da tabela Usuários
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(250) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) CHECK (tipo IN ('ADMIN', 'DOADOR')) DEFAULT 'DOADOR',
	centro_id INTEGER REFERENCES centros_distribuicao(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir Usuários (Admin e Doador)
INSERT INTO usuarios (nome, email, senha, tipo) VALUES 
('Rafael Raizer', 'rafael@admin.com', 'admin123', 'ADMIN'),
('Carlos Souza', 'carlos@admin.com', 'admin123', 'ADMIN'),
('Marcia Raizer', 'marcinha@gmail.com', 'doador123', 'DOADOR');

-- Adicionar coluna centro_id na tabela usuarios para relacionar com centros_distribuicao
ALTER TABLE usuarios ADD COLUMN centro_id INTEGER REFERENCES centros_distribuicao(id);

-- Execute isso no seu terminal do Postgres ou ferramenta de query:
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS centro_id INTEGER REFERENCES centros_distribuicao(id);

--  Consultar a tabela usuarios
SELECT * FROM usuarios ORDER BY tipo ASC;

-- Criação da tabela de Centros de Distribuição
CREATE TABLE centros_distribuicao (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    endereco TEXT NOT NULL,
    cidade VARCHAR(50) NOT NULL,
    telefone VARCHAR(20),
    responsavel VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir tabela Centros de Distribuição (Abrigos/Pontos de Coleta)
INSERT INTO centros_distribuicao (nome, endereco, cidade, telefone, responsavel) VALUES 
('Ginásio Municipal Central', 'Rua das Flores, 123', 'Gaspar', '47 9999-0001', 'Rafael Raizer'),
('Igreja Matriz - Salão Paroquial', 'Praça da Matriz, s/n', 'Gaspar', '47 9999-0002', 'Carlos Souza');

-- Consultar a tabela Centro de Distribuição
SELECT * FROM centros_distribuicao;

-- Criação da tabela de Categorias de Itens (Alimento, Higiene, Vestuário, etc)
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);
-- Inseir tabela Categorias
INSERT INTO categorias (nome) VALUES ('Alimentos'), ('Higiene Pessoal'), ('Limpeza');

--  Consultar a tabela Categorias
SELECT * FROM categorias;

-- Criação da tabela Necessidades 
CREATE TABLE necessidades (
    id SERIAL PRIMARY KEY,
    centro_id INTEGER REFERENCES centros_distribuicao(id) ON DELETE CASCADE,
    categoria_id INTEGER REFERENCES categorias(id),
    item_nome VARCHAR(100) NOT NULL,
    quantidade_objetivo INTEGER NOT NULL,
    quantidade_atual INTEGER DEFAULT 0,
    prioridade VARCHAR(10) CHECK (prioridade IN ('BAIXA', 'MEDIA', 'ALTA', 'CRITICA')),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*Inserir a tabela Necessidades (Relacionando com IDs acima)
Supondo que o Ginasio (ID 1) e a Igreja (ID 2) do CT-Distribuição  
Alimentos seja (ID 1), Higienes Pessoal (ID 2) e Limpeza (ID 3) */  
INSERT INTO necessidades (centro_id, categoria_id, item_nome, quantidade_objetivo, quantidade_atual, prioridade) VALUES 
-- Caso 1: Quase cheio (85%) -> Prioridade Baixa
(1, 1, 'Cestas Básicas', 100, 85, 'BAIXA'), 

-- Caso 2: Muito vazio (15%) -> Prioridade Crítica
(2, 2, 'Kits de Higiene', 200, 30, 'CRITICA'), 

-- Caso 3: Vazio (20%) -> Prioridade Alta
(1, 3, 'Sabão em Pó', 50, 10, 'ALTA')

-- Adicionar coluna status na tabela necessidades para indicar se a necessidade está ativa ou já foi atendida
ALTER TABLE necessidades ADD COLUMN status VARCHAR(20) DEFAULT 'ATIVO';
-- Consultar a tabela necessidades
SELECT * FROM necessidades

/* Consultar a tabela com Join para junta as três tabelas para mostrar
nomes em vez de apenas IDs: usando Decimal para garantir que o resultado
não seja zero e ROUND para ficar bonito*/

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

-- Criação da tabelaRegistro de Doações 
CREATE TABLE registro_doacoes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id), 
    necessidade_id INTEGER REFERENCES necessidades(id), 
	item_avulso_nome VARCHAR(250),
    quantidade_doada INTEGER NOT NULL, 
    status VARCHAR(20) CHECK (status IN ('PENDENTE', 'ENTREGUE', 'CANCELADO')) DEFAULT 'PENDENTE',
    data_intencao TIMESTAMP DEFAULT CURRENT_TIMESTAMP    
);

-- Deletando Coluna Data Entrega Real
ALTER TABLE registro_doacoes 
DROP COLUMN data_entrega_real;

-- Adicionar coluna item_avulso_nome para permitir doações de itens que não estão na tabela necessidades
ALTER TABLE registro_doacoes ADD COLUMN item_avulso_nome VARCHAR(250);

-- Inserir a tabela Registro de Doações (Relacionando com IDs acima)
INSERT INTO registro_doacoes (usuario_id, necessidade_id, quantidade_doada, status) VALUES 
(6, 4, 5, 'PENDENTE'), -- O Doador 3 prometeu 5 fardos de agua  para a necessidade 4
(10, 5, 10, 'ENTREGUE');  -- O Doador 3 já entregou 10 fardos de detergente a necessidade 5

SELECT * FROM registro_doacoes ORDER BY status ASC, data_intencao DESC;

/*Aqui o usuário consulta o que está doando e como está o processo, 
filtrando por nome ao invés do ID.*/
SELECT 
	u.nome AS doador,
    c.nome AS centro_destino,
    n.item_nome AS item, 
    rd.quantidade_doada, 
    rd.status, 
    rd.data_intencao
FROM registro_doacoes rd
JOIN usuarios u ON rd.usuario_id = u.id
JOIN necessidades n ON rd.necessidade_id = n.id
JOIN centros_distribuicao c ON n.centro_id = c.id 


/*   Consulta detalhada para o (ADM) de doações vinculando nomes de 
usuários, itens e destinos e filtra pedindo ao banco o que está pendente
e ordena pela data de intenção mais recente .*/

SELECT 
    rd.id AS registro_id,
    u.nome AS doador, 
    n.item_nome AS item_doado, 
    rd.quantidade_doada, 
    rd.data_intencao
FROM registro_doacoes rd
JOIN usuarios u ON rd.usuario_id = u.id
JOIN necessidades n ON rd.necessidade_id = n.id
WHERE rd.status = 'PENDENTE' 
ORDER BY rd.data_intencao DESC;