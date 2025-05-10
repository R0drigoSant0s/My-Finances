import AppLayout from '@/components/Layout/AppLayout';
import { 
  PlusCircle, 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Trash2, 
  Edit, 
  ShoppingCart,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';

export default function CreditCardsPage() {
  // Exemplo de cartões de crédito (na implementação real, viria de uma API)
  const [cards, setCards] = useState([
    { 
      id: 1, 
      name: 'Nubank', 
      lastDigits: '3456',
      limit: 5000,
      used: 2350.75,
      dueDay: 15,
      closingDay: 8,
      color: 'bg-purple-600'
    },
    { 
      id: 2, 
      name: 'Itaú Visa', 
      lastDigits: '7890',
      limit: 8000, 
      used: 3242.18,
      dueDay: 22,
      closingDay: 15,
      color: 'bg-orange-600' 
    },
    { 
      id: 3, 
      name: 'Banco do Brasil', 
      lastDigits: '1234',
      limit: 3500, 
      used: 850.00,
      dueDay: 10,
      closingDay: 3,
      color: 'bg-yellow-600' 
    },
  ]);
  
  // Modal para adicionar novo cartão
  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false);
  const [newCardData, setNewCardData] = useState({
    name: '',
    lastDigits: '',
    limit: '',
    dueDay: '',
    closingDay: '',
    color: 'bg-blue-600'
  });
  
  // Função para adicionar novo cartão
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCard = {
      id: cards.length + 1,
      name: newCardData.name,
      lastDigits: newCardData.lastDigits,
      limit: parseFloat(newCardData.limit),
      used: 0,
      dueDay: parseInt(newCardData.dueDay),
      closingDay: parseInt(newCardData.closingDay),
      color: newCardData.color
    };
    
    setCards([...cards, newCard]);
    setIsNewCardModalOpen(false);
    setNewCardData({
      name: '',
      lastDigits: '',
      limit: '',
      dueDay: '',
      closingDay: '',
      color: 'bg-blue-600'
    });
  };
  
  // Função para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Função para calcular o disponível
  const calculateAvailable = (limit: number, used: number) => {
    return limit - used;
  };
  
  // Função para calcular a porcentagem utilizada
  const calculateUsedPercentage = (limit: number, used: number) => {
    return Math.min(Math.round((used / limit) * 100), 100);
  };

  // Função para obter a cor de alerta com base na porcentagem utilizada
  const getAlertColor = (percentage: number) => {
    if (percentage < 50) return 'text-emerald-600 dark:text-emerald-400';
    if (percentage < 80) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  // Função para obter o texto de alerta com base na porcentagem utilizada
  const getAlertText = (percentage: number) => {
    if (percentage < 50) return 'Uso saudável';
    if (percentage < 80) return 'Fique atento';
    return 'Limite crítico';
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cartões de Crédito</h1>
          
          <button 
            onClick={() => setIsNewCardModalOpen(true)}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Cartão
          </button>
        </div>
        
        {/* Resumo dos cartões */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
                <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Cartões</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{cards.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-md">
                <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Limite Total</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(cards.reduce((acc, card) => acc + card.limit, 0))}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-md">
                <ShoppingCart className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Utilizado</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(cards.reduce((acc, card) => acc + card.used, 0))}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Lista de cartões */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const available = calculateAvailable(card.limit, card.used);
            const usedPercentage = calculateUsedPercentage(card.limit, card.used);
            const alertColor = getAlertColor(usedPercentage);
            const alertText = getAlertText(usedPercentage);
            
            return (
              <div key={card.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className={`${card.color} h-2`}></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {card.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        •••• {card.lastDigits}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Limite</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(card.limit)}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Utilizado</span>
                        <span className="text-sm font-semibold text-red-600 dark:text-red-400">{formatCurrency(card.used)}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Disponível</span>
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(available)}</span>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Utilização</span>
                        <span className={`text-sm font-semibold ${alertColor}`}>{usedPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${card.color}`} 
                          style={{ width: `${usedPercentage}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center mt-1">
                        <AlertCircle className={`h-3 w-3 ${alertColor} mr-1`} />
                        <span className={`text-xs ${alertColor}`}>{alertText}</span>
                      </div>
                    </div>
                    
                    <div className="flex pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <Calendar className="h-3 w-3 text-gray-500 dark:text-gray-400 mr-1" />
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Vencimento</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Todo dia {card.dueDay}</p>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <Calendar className="h-3 w-3 text-gray-500 dark:text-gray-400 mr-1" />
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Fechamento</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Todo dia {card.closingDay}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Modal para adicionar novo cartão */}
      {isNewCardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Novo Cartão de Crédito</h3>
              <button 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                onClick={() => setIsNewCardModalOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddCard}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome do Cartão
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={newCardData.name}
                    onChange={(e) => setNewCardData({...newCardData, name: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ex: Nubank, Itaú, etc."
                  />
                </div>
                
                <div>
                  <label htmlFor="lastDigits" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Últimos 4 dígitos
                  </label>
                  <input
                    type="text"
                    id="lastDigits"
                    required
                    maxLength={4}
                    pattern="[0-9]{4}"
                    value={newCardData.lastDigits}
                    onChange={(e) => setNewCardData({...newCardData, lastDigits: e.target.value.replace(/[^0-9]/g, '')})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0000"
                  />
                </div>
                
                <div>
                  <label htmlFor="limit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Limite do Cartão (R$)
                  </label>
                  <input
                    type="number"
                    id="limit"
                    required
                    min="0"
                    step="0.01"
                    value={newCardData.limit}
                    onChange={(e) => setNewCardData({...newCardData, limit: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0,00"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dueDay" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Dia de Vencimento
                    </label>
                    <input
                      type="number"
                      id="dueDay"
                      required
                      min="1"
                      max="31"
                      value={newCardData.dueDay}
                      onChange={(e) => setNewCardData({...newCardData, dueDay: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="1-31"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="closingDay" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Dia de Fechamento
                    </label>
                    <input
                      type="number"
                      id="closingDay"
                      required
                      min="1"
                      max="31"
                      value={newCardData.closingDay}
                      onChange={(e) => setNewCardData({...newCardData, closingDay: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="1-31"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cor do Cartão
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['bg-blue-600', 'bg-red-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600', 'bg-yellow-600', 'bg-indigo-600', 'bg-pink-600'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full ${color} border-2 ${newCardData.color === color ? 'border-white dark:border-gray-300' : 'border-transparent'}`}
                        onClick={() => setNewCardData({...newCardData, color})}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCardModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Adicionar Cartão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}