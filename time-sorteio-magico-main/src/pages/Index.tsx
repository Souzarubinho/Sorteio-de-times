import { useState } from "react";
import { PlayerInput } from "@/components/PlayerInput";
import { DrawButton } from "@/components/DrawButton";
import { TeamDisplay } from "@/components/TeamDisplay";
import { WeeklyStats } from "@/components/WeeklyStats";
import { PaymentTracker } from "@/components/PaymentTracker";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw, Users, DollarSign, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import footballFieldHero from "@/assets/football-field-hero.jpg";

interface Player {
  name: string;
  rating: number;
}

interface Team {
  name: string;
  players: Player[];
  color: 'a' | 'b';
  avgRating: number;
}

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isDrawn, setIsDrawn] = useState(false);
  const { toast } = useToast();

  const addPlayer = (player: Player) => {
    if (players.some(p => p.name === player.name)) {
      toast({
        title: "Jogador já existe",
        description: "Este jogador já foi adicionado à lista.",
        variant: "destructive",
      });
      return;
    }
    setPlayers([...players, player]);
    toast({
      title: "Jogador adicionado",
      description: `${player.name} foi adicionado com ${player.rating} estrela${player.rating !== 1 ? 's' : ''}!`,
    });
  };

  const removePlayer = (index: number) => {
    const removedPlayer = players[index];
    setPlayers(players.filter((_, i) => i !== index));
    toast({
      title: "Jogador removido",
      description: `${removedPlayer.name} foi removido da lista.`,
    });
  };

  const updatePlayer = (index: number, updatedPlayer: Player) => {
    const newPlayers = [...players];
    newPlayers[index] = updatedPlayer;
    setPlayers(newPlayers);
    toast({
      title: "Jogador atualizado",
      description: `${updatedPlayer.name} agora tem ${updatedPlayer.rating} estrela${updatedPlayer.rating !== 1 ? 's' : ''}!`,
    });
  };

  const handleDraw = (newTeams: Team[]) => {
    setTeams(newTeams);
    setIsDrawn(true);
    toast({
      title: "Times sorteados!",
      description: "Os times foram formados com sucesso!",
    });
  };

  const resetDraw = () => {
    setTeams([]);
    setIsDrawn(false);
    toast({
      title: "Sorteio reiniciado",
      description: "Você pode fazer um novo sorteio.",
    });
  };

  const clearAll = () => {
    setPlayers([]);
    setTeams([]);
    setIsDrawn(false);
    toast({
      title: "Lista limpa",
      description: "Todos os jogadores foram removidos.",
    });
  };

  const handlePaymentComplete = (paidPlayers: string[]) => {
    // Add paid players to the players list automatically
    const newPlayers = paidPlayers.map(name => ({ name, rating: 3 }));
    setPlayers(newPlayers);
    setIsDrawn(false);
    toast({
      title: "Jogadores carregados!",
      description: `${paidPlayers.length} jogadores que pagaram foram adicionados ao sorteio.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${footballFieldHero})` }}
        />
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in">
            ⚽ Sorteio de Times
          </h1>
          <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
            Forme times equilibrados de forma rápida e divertida
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16 space-y-8">
        <Tabs defaultValue="caixa" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
            <TabsTrigger value="caixa" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Caixa
            </TabsTrigger>
            <TabsTrigger value="sorteio" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Sorteio
            </TabsTrigger>
            <TabsTrigger value="vitorias" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Vitórias da Semana
            </TabsTrigger>
          </TabsList>

          <TabsContent value="caixa">
            <PaymentTracker onPaymentComplete={handlePaymentComplete} />
          </TabsContent>

          <TabsContent value="sorteio" className="space-y-8">
            <PlayerInput
              players={players}
              onAddPlayer={addPlayer}
              onRemovePlayer={removePlayer}
              onUpdatePlayer={updatePlayer}
            />

            <div className="flex flex-col gap-4 justify-center items-center">
              <div className="flex gap-3">
                <DrawButton
                  players={players}
                  onDraw={handleDraw}
                  disabled={players.length < 5}
                />
                
                {players.length > 0 && (
                  <Button
                    onClick={clearAll}
                    variant="destructive"
                    size="lg"
                    className="h-12 px-8 min-w-[140px]"
                  >
                    Limpar Tudo
                  </Button>
                )}
              </div>
              
              {isDrawn && (
                <Button
                  onClick={resetDraw}
                  variant="outline"
                  size="lg"
                  className="px-6"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Novo Sorteio
                </Button>
              )}
            </div>

            <TeamDisplay teams={teams} isDrawn={isDrawn} />
          </TabsContent>

          <TabsContent value="vitorias">
            <WeeklyStats teams={teams} isDrawn={isDrawn} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;