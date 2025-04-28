import { describe, it, expect, beforeEach } from 'vitest';
// Ajuste as importações conforme a nova arquitetura
import { criarTabuleiroVazio, criarPeca } from '../models/novoFactory'; // Exemplo de importação
import { validarMovimento } from '../utils/novoMovimento'; // Exemplo de importação

describe('Testes de Movimento das Peças', () => {
  let tabuleiro: any;

  beforeEach(() => {
    tabuleiro = criarTabuleiroVazio();
  });

  describe('Peão', () => {
    it('deve permitir movimento simples para frente', () => {
      const peao = criarPeca('peao', 'branco', { linha: 6, coluna: 0 });
      tabuleiro[6][0] = peao;
      const valido = validarMovimento(peao, { linha: 6, coluna: 0 }, { linha: 5, coluna: 0 }, tabuleiro);
      expect(valido).toBe(true);
    });

    it('deve permitir movimento duplo inicial', () => {
      const peao = criarPeca('peao', 'branco', { linha: 6, coluna: 0 });
      tabuleiro[6][0] = peao;
      const valido = validarMovimento(peao, { linha: 6, coluna: 0 }, { linha: 4, coluna: 0 }, tabuleiro);
      expect(valido).toBe(true);
    });

    it('não deve permitir avançar com peça na frente', () => {
      const peao = criarPeca('peao', 'branco', { linha: 6, coluna: 0 });
      const bloqueio = criarPeca('torre', 'branco', { linha: 5, coluna: 0 });
      tabuleiro[6][0] = peao;
      tabuleiro[5][0] = bloqueio;
      const valido = validarMovimento(peao, { linha: 6, coluna: 0 }, { linha: 5, coluna: 0 }, tabuleiro);
      expect(valido).toBe(false);
    });

    it('não deve capturar peça inimiga em linha reta', () => {
      const peao = criarPeca('peao', 'branco', { linha: 6, coluna: 0 });
      const inimigo = criarPeca('peao', 'preto', { linha: 5, coluna: 0 });
      tabuleiro[6][0] = peao;
      tabuleiro[5][0] = inimigo;
      const valido = validarMovimento(peao, { linha: 6, coluna: 0 }, { linha: 5, coluna: 0 }, tabuleiro);
      expect(valido).toBe(false);
    });

    it('deve capturar peça inimiga na diagonal', () => {
      const peao = criarPeca('peao', 'branco', { linha: 6, coluna: 0 });
      const inimigo = criarPeca('peao', 'preto', { linha: 5, coluna: 1 });
      tabuleiro[6][0] = peao;
      tabuleiro[5][1] = inimigo;
      const valido = validarMovimento(peao, { linha: 6, coluna: 0 }, { linha: 5, coluna: 1 }, tabuleiro);
      expect(valido).toBe(true);
    });

    it('não deve capturar peça da mesma cor', () => {
      const peao = criarPeca('peao', 'branco', { linha: 6, coluna: 0 });
      const amigo = criarPeca('torre', 'branco', { linha: 5, coluna: 1 });
      tabuleiro[6][0] = peao;
      tabuleiro[5][1] = amigo;
      const valido = validarMovimento(peao, { linha: 6, coluna: 0 }, { linha: 5, coluna: 1 }, tabuleiro);
      expect(valido).toBe(false);
    });

    it('deve permitir en passant', () => {
      const alvoEnPassant = { linha: 5, coluna: 1 };
      const peaoBranco = criarPeca('peao', 'branco', { linha: 6, coluna: 1 });
      const peaoPreto = criarPeca('peao', 'preto', { linha: 4, coluna: 0 });
      tabuleiro[6][1] = peaoBranco;
      tabuleiro[4][0] = peaoPreto;
      const valido = validarMovimento(peaoBranco, { linha: 6, coluna: 1 }, { linha: 4, coluna: 1 }, tabuleiro, alvoEnPassant);
      expect(valido).toBe(true);
    });
  });

  describe('Torre', () => {
    it('não deve pular peças', () => {
      const torre = criarPeca('torre', 'branco', { linha: 7, coluna: 0 });
      const bloqueio = criarPeca('peao', 'branco', { linha: 6, coluna: 0 });
      tabuleiro[7][0] = torre;
      tabuleiro[6][0] = bloqueio;
      const valido = validarMovimento(torre, { linha: 7, coluna: 0 }, { linha: 4, coluna: 0 }, tabuleiro);
      expect(valido).toBe(false);
    });

    it('deve andar em linha reta', () => {
      const torre = criarPeca('torre', 'branco', { linha: 7, coluna: 0 });
      tabuleiro[7][0] = torre;
      const valido = validarMovimento(torre, { linha: 7, coluna: 0 }, { linha: 4, coluna: 0 }, tabuleiro);
      expect(valido).toBe(true);
    });
  });

  describe('Cavalo', () => {
    it('deve pular peças', () => {
      const cavalo = criarPeca('cavalo', 'branco', { linha: 7, coluna: 1 });
      const bloqueio = criarPeca('peao', 'branco', { linha: 6, coluna: 1 });
      tabuleiro[7][1] = cavalo;
      tabuleiro[6][1] = bloqueio;
      const valido = validarMovimento(cavalo, { linha: 7, coluna: 1 }, { linha: 5, coluna: 2 }, tabuleiro);
      expect(valido).toBe(true);
    });

    it('não deve capturar peça da mesma cor', () => {
      const cavalo = criarPeca('cavalo', 'branco', { linha: 7, coluna: 1 });
      const amigo = criarPeca('peao', 'branco', { linha: 5, coluna: 2 });
      tabuleiro[7][1] = cavalo;
      tabuleiro[5][2] = amigo;
      const valido = validarMovimento(cavalo, { linha: 7, coluna: 1 }, { linha: 5, coluna: 2 }, tabuleiro);
      expect(valido).toBe(false);
    });
  });

  describe('Bispo', () => {
    it('deve andar na diagonal', () => {
      const bispo = criarPeca('bispo', 'branco', { linha: 7, coluna: 2 });
      tabuleiro[7][2] = bispo;
      const valido = validarMovimento(bispo, { linha: 7, coluna: 2 }, { linha: 5, coluna: 4 }, tabuleiro);
      expect(valido).toBe(true);
    });
  });

  describe('Rainha', () => {
    it('deve andar na diagonal', () => {
      const rainha = criarPeca('rainha', 'branco', { linha: 7, coluna: 3 });
      tabuleiro[7][3] = rainha;
      const valido = validarMovimento(rainha, { linha: 7, coluna: 3 }, { linha: 5, coluna: 5 }, tabuleiro);
      expect(valido).toBe(true);
    });
  });

  describe('Rei', () => {
    it('deve andar uma casa', () => {
      const rei = criarPeca('rei', 'branco', { linha: 7, coluna: 4 });
      tabuleiro[7][4] = rei;
      const valido = validarMovimento(rei, { linha: 7, coluna: 4 }, { linha: 6, coluna: 4 }, tabuleiro);
      expect(valido).toBe(true);
    });

    it('deve permitir roque', () => {
      const rei = criarPeca('rei', 'branco', { linha: 7, coluna: 4 });
      const torre = criarPeca('torre', 'branco', { linha: 7, coluna: 7 });
      tabuleiro[7][4] = rei;
      tabuleiro[7][7] = torre;
      const valido = validarMovimento(rei, { linha: 7, coluna: 4 }, { linha: 7, coluna: 6 }, tabuleiro);
      expect(valido).toBe(true);
    });
  });
});
