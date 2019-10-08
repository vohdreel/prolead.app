export interface permissoesCompetencias {
    temAutoAvaliacao: boolean;
    temAvaliacaoLiderados: boolean;
    temAvaliacaoPares: boolean;
    temAvaliacaoConsenso: boolean;
    temAvaliacaoEquipe: boolean;
    deveHabilitarResponderAvaliacao: boolean;
    deveHabilitarResultadosLiderados: boolean;
    deveHabilitarMeusResultados: boolean;
  }

  export interface permissoesFeedback {
    podeAtribuirAutoFeedback: boolean;
    podeAtribuirFeedbackColaborador: boolean;
    podeAtribuirFeedbackLiderado: boolean;
    podeAtribuirFeedbackLider: boolean;
    podeVisualizarAutoFeedbackLiderado: boolean;
    podeVisualizarFeedbackColaborador: boolean;
    podeVisualizarFeedbackLider: boolean;
    PodeLideradoVisualizarFeedbackColpaborador: boolean;
    podeAtribuir: boolean;
    podeVisualizar: boolean;
  }

export interface Questao {
  IdControle: number;
  IdNota: number;
  Observacao: string;
  RespostaNome: string;
  RespostaPeso: number;
  IdQuestao: number;
  Competencia: number;
}

export interface InfoColaborador {
  Nome: string;
  Foto: string;
  Data: string;
}