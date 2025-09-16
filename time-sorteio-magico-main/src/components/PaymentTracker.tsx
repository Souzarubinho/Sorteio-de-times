import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DollarSign, Calendar, CheckCircle2, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SUGGESTED_PLAYERS = [
  "Rubens", "Felipe Nobre", "Yuri Cocô", "Guimaraes", "Bruno", "Roceiro", 
  "Foguete no Rabo", "Oliveira", "Paraíba", "Barra", "Pato", "Pedro Gordão",
  "Marcao", "Branco", "Renan", "Lucas Andrew", "Rodrigo China", "Yuri nobre", 
  "Valtinho", "Everton Cetão", "Yuri Moura", "Vitor convidado", "Bruno Nogueira", 
  "Juninho", "Lucas Almeida", "Marcos Paulo", "MTS", "Felipe Safanhoto", 
  "Amigo marquinhos", "João"
];

interface PaymentRecord {
  playerName: string;
  paid: boolean;
  date: string;
}

interface WeeklyCollection {
  date: string;
  payments: Record<string, boolean>;
  isCompleted: boolean;
  totalPaid: number;
  totalAmount: number;
  paidPlayers: string[];
}

interface PaymentTrackerProps {
  className?: string;
  onPaymentComplete?: (paidPlayers: string[]) => void;
}

// Função para gerar todas as terças-feiras até 2027
const generateTuesdays = (): string[] => {
  const tuesdays: string[] = [];
  const start = new Date();
  
  // Encontrar a próxima terça-feira
  const dayOfWeek = start.getDay();
  const daysUntilTuesday = dayOfWeek === 2 ? 0 : (2 + 7 - dayOfWeek) % 7;
  const nextTuesday = new Date(start);
  nextTuesday.setDate(start.getDate() + daysUntilTuesday);
  
  const current = new Date(nextTuesday);
  const endYear = 2027;
  
  while (current.getFullYear() <= endYear) {
    tuesdays.push(current.toLocaleDateString('pt-BR'));
    current.setDate(current.getDate() + 7); // Próxima terça
  }
  
  return tuesdays;
};

export const PaymentTracker = ({ className, onPaymentComplete }: PaymentTrackerProps) => {
  const [collections, setCollections] = useState<Record<string, WeeklyCollection>>({});
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [tuesdays] = useState<string[]>(generateTuesdays());
  const { toast } = useToast();

  const currentDate = new Date().toLocaleDateString('pt-BR');

  // Inicializar coleção para a data atual se não existir
  useEffect(() => {
    if (!collections[currentDate]) {
      setCollections(prev => ({
        ...prev,
        [currentDate]: {
          date: currentDate,
          payments: SUGGESTED_PLAYERS.reduce((acc, player) => ({ ...acc, [player]: false }), {}),
          isCompleted: false,
          totalPaid: 0,
          totalAmount: 0,
          paidPlayers: []
        }
      }));
    }
  }, [currentDate, collections]);

  const handlePaymentToggle = (date: string, playerName: string) => {
    setCollections(prev => {
      const collection = prev[date];
      if (!collection || collection.isCompleted) return prev;

      const newPayments = {
        ...collection.payments,
        [playerName]: !collection.payments[playerName]
      };

      const totalPaid = Object.values(newPayments).filter(Boolean).length;

      return {
        ...prev,
        [date]: {
          ...collection,
          payments: newPayments,
          totalPaid,
          totalAmount: totalPaid * 10
        }
      };
    });
  };

  const handleCloseCollection = (date: string) => {
    setCollections(prev => {
      const collection = prev[date];
      if (!collection) return prev;

      const paidPlayers = Object.entries(collection.payments)
        .filter(([_, paid]) => paid)
        .map(([playerName]) => playerName);

      const updatedCollection = {
        ...collection,
        isCompleted: true,
        paidPlayers
      };

      toast({
        title: "Recolhimento finalizado!",
        description: `${paidPlayers.length} jogadores pagaram a pelada do dia ${date}`,
      });

      // Call the callback to update the sorteio with paid players
      onPaymentComplete?.(paidPlayers);

      return {
        ...prev,
        [date]: updatedCollection
      };
    });

    setExpandedDate(null);
  };

  const handleReopenCollection = (date: string) => {
    setCollections(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        isCompleted: false
      }
    }));
    
    toast({
      title: "Recolhimento reaberto",
      description: `Você pode editar os pagamentos do dia ${date}`,
    });
  };

  const createNewCollection = (date: string) => {
    setCollections(prev => ({
      ...prev,
      [date]: {
        date,
        payments: SUGGESTED_PLAYERS.reduce((acc, player) => ({ ...acc, [player]: false }), {}),
        isCompleted: false,
        totalPaid: 0,
        totalAmount: 0,
        paidPlayers: []
      }
    }));
    setExpandedDate(date);
  };

  const toggleExpanded = (date: string) => {
    if (expandedDate === date) {
      setExpandedDate(null);
    } else {
      setExpandedDate(date);
      if (!collections[date]) {
        createNewCollection(date);
      }
    }
  };

  return (
    <div className={className}>
      <Card className="p-6 space-y-4 bg-gradient-card shadow-field animate-fade-in">
        <div className="flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-semibold text-foreground">Controle de Caixa - Terças-feiras</h2>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {tuesdays.slice(0, 50).map((date) => { // Mostrar primeiras 50 terças
            const collection = collections[date];
            const isExpanded = expandedDate === date;
            const hasData = !!collection;
            const isCompleted = collection?.isCompleted || false;

            return (
              <Collapsible key={date} open={isExpanded} onOpenChange={() => toggleExpanded(date)}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`w-full justify-between p-4 h-auto ${
                      isCompleted 
                        ? 'bg-accent/10 border border-accent/30 hover:bg-accent/20' 
                        : hasData 
                        ? 'bg-primary/10 border border-primary/30 hover:bg-primary/20'
                        : 'hover:bg-secondary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">{date}</span>
                      {isCompleted && (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                          <span className="text-sm text-muted-foreground">
                            {collection.paidPlayers.length} jogadores • R$ {collection.totalAmount}
                          </span>
                        </>
                      )}
                      {hasData && !isCompleted && (
                        <span className="text-sm text-primary">Em andamento</span>
                      )}
                      {!hasData && (
                        <Plus className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="px-4 pb-4">
                  {collection && (
                    <div className="space-y-4 mt-4 bg-secondary/30 rounded-lg p-4">
                      {!isCompleted ? (
                        <>
                          <div className="grid grid-cols-2 gap-4 p-3 bg-secondary/50 rounded-lg">
                            <div className="text-center">
                              <div className="text-xl font-bold text-accent">{collection.totalPaid}</div>
                              <div className="text-sm text-muted-foreground">Jogadores</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xl font-bold text-primary">R$ {collection.totalAmount}</div>
                              <div className="text-sm text-muted-foreground">Total arrecadado</div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-medium text-foreground">
                              Marque quem pagou os R$ 10,00:
                            </h4>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {SUGGESTED_PLAYERS.map((playerName) => (
                                <div
                                  key={playerName}
                                  className={`flex items-center justify-between p-2 rounded transition-all ${
                                    collection.payments[playerName] 
                                      ? 'bg-accent/20 border border-accent/30' 
                                      : 'bg-secondary hover:bg-secondary/80'
                                  }`}
                                >
                                  <Label 
                                    htmlFor={`payment-${date}-${playerName}`}
                                    className="text-sm font-medium text-foreground cursor-pointer flex-1"
                                  >
                                    {playerName}
                                  </Label>
                                  <Switch
                                    id={`payment-${date}-${playerName}`}
                                    checked={collection.payments[playerName]}
                                    onCheckedChange={() => handlePaymentToggle(date, playerName)}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          <Button 
                            onClick={() => handleCloseCollection(date)}
                            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                            disabled={collection.totalPaid === 0}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Fechar recolhimento do dinheiro
                          </Button>
                        </>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-accent flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5" />
                              Recolhimento finalizado
                            </h4>
                            <Button
                              onClick={() => handleReopenCollection(date)}
                              variant="outline"
                              size="sm"
                            >
                              Editar
                            </Button>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-2">
                            <h5 className="font-medium text-foreground">Jogadores que pagaram:</h5>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                              {collection.paidPlayers.map((playerName, index) => (
                                <div 
                                  key={index}
                                  className="text-sm text-foreground bg-secondary/50 p-2 rounded text-center"
                                >
                                  {playerName}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="text-center p-3 bg-accent/10 rounded-lg">
                            <div className="text-lg font-bold text-accent">
                              Total: R$ {collection.totalAmount},00
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {collection.paidPlayers.length} jogadores pagaram
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </Card>
    </div>
  );
};