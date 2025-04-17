// Arquivo para suporte de funções serverless no Netlify
// Este é um stub básico, que será substituído pelo build real do servidor

exports.handler = async (event, context) => {
  // Como estamos usando o redirecionamento para o front-end no SPA,
  // esta função não será usada para servir páginas HTML
  
  // Para APIs, você precisará implementar as rotas e lógica relevantes aqui
  // quando estiver criando um back-end serverless completo

  // Para esta aplicação front-end simples, retornamos um erro 404 para APIs inexistentes
  return {
    statusCode: 404,
    body: JSON.stringify({ message: "API not implemented in this deployment" })
  };
};