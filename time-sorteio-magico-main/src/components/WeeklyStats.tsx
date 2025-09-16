import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, Crown, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface WeeklyTeamStats {
  id: number;
  name: string;
  players: Player[];
  wins: number;
  draws: number;
  losses: number;
  points: number;
  isWinner: boolean;
}

interface WeeklyStatsProps {
  teams: Team[];
  isDrawn: boolean;
}

export const WeeklyStats = ({ teams, isDrawn }: WeeklyStatsProps) => {
  const [weeklyTeams, setWeeklyTeams] = useState<WeeklyTeamStats[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);
  const { toast } = useToast();

  // Initialize weekly stats from current teams
  const initializeWeeklyStats = () => {
    const initialStats = teams.map((team, index) => ({
      id: index,
      name: team.name,
      players: team.players,
      wins: 0,
      draws: 0,
      losses: 0,
      points: 0,
      isWinner: false
    }));
    setWeeklyTeams(initialStats);
    setHasCalculated(false);
    toast({
      title: "Estatísticas da semana inicializadas",
      description: `${teams.length} times prontos para registrar resultados!`,
    });
  };

  const updateTeamStat = (teamId: number, field: 'wins' | 'draws' | 'losses', value: number) => {
    const updatedTeams = weeklyTeams.map(team => {
      if (team.id === teamId) {
        const updatedTeam = {
          ...team,
          [field]: Math.max(0, value)
        };
        
        // Calculate points (3 for win, 1 for draw, 0 for loss)
        updatedTeam.points = (updatedTeam.wins * 3) + (updatedTeam.draws * 1);
        
        return updatedTeam;
      }
      return team;
    });
    
    setWeeklyTeams(updatedTeams);
    setHasCalculated(false);
  };

  const calculateWeeklyWinner = () => {
    if (weeklyTeams.length === 0) return;
    
    // Sort teams by points, then by wins, then by total games
    const sortedTeams = [...weeklyTeams].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return (b.wins + b.draws + b.losses) - (a.wins + a.draws + a.losses);
    });
    
    const winner = sortedTeams[0];
    const updatedTeams = weeklyTeams.map(team => ({
      ...team,
      isWinner: team.id === winner.id
    }));
    
    setWeeklyTeams(updatedTeams);
    setHasCalculated(true);
    
    toast({
      title: "🏆 Time Vencedor da Semana!",
      description: `${winner.name} é o campeão com ${winner.points} pontos! (${winner.wins} vitórias, ${winner.draws} empates, ${winner.losses} derrotas)`,
    });
  };

  const resetWeeklyStats = () => {
    setWeeklyTeams([]);
    setHasCalculated(false);
    toast({
      title: "Estatísticas resetadas",
      description: "Todas as estatísticas da semana foram limpas.",
    });
  };

  if (!isDrawn || teams.length === 0) {
    return (
      <Card className="p-8 text-center bg-card shadow-field">
        <Crown className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          Nenhum time sorteado
        </h3>
        <p className="text-sm text-muted-foreground">
          Sorteie os times primeiro para gerenciar vitórias da semana
        </p>
      </Card>
    );
  }

  if (weeklyTeams.length === 0) {
    return (
      <Card className="p-6 bg-card shadow-field">
        <div className="text-center mb-6">
          <Crown className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Vitórias da Semana
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Registre os resultados dos {teams.length} times sorteados para descobrir o time vencedor da semana
          </p>
          <Button onClick={initializeWeeklyStats} variant="field" size="lg">
            <BarChart3 className="w-4 h-4 mr-2" />
            Inicializar Estatísticas da Semana
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card shadow-field">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Vitórias da Semana
          </h3>
          <div className="flex gap-2">
            <Button onClick={calculateWeeklyWinner} variant="field" size="sm">
              <Trophy className="w-4 h-4 mr-2" />
              Calcular Vencedor
            </Button>
            <Button onClick={resetWeeklyStats} variant="outline" size="sm">
              Resetar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {weeklyTeams.map((team) => (
            <Card 
              key={team.id} 
              className={`p-4 transition-all duration-300 ${
                team.isWinner && hasCalculated 
                  ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400 ring-2 ring-yellow-300 dark:from-yellow-900/30 dark:to-yellow-800/30 dark:border-yellow-500' 
                  : team.id % 2 === 0 
                    ? 'bg-team-a/20 border-team-a' 
                    : 'bg-team-b/20 border-team-b'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {team.isWinner && hasCalculated && (
                  <Crown className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                )}
                <div className={`w-4 h-4 rounded-full ${team.id % 2 === 0 ? 'bg-team-a' : 'bg-team-b'}`} />
                <h4 className="font-semibold text-foreground">{team.name}</h4>
                <div className="ml-auto flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="font-bold text-lg">{team.points}pts</span>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="text-xs text-muted-foreground">Jogadores:</div>
                <div className="flex flex-wrap gap-1">
                  {team.players.map((player, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs bg-secondary px-2 py-1 rounded-full"
                    >
                      {player.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground">Vitórias</label>
                  <Input
                    type="number"
                    min="0"
                    value={team.wins}
                    onChange={(e) => updateTeamStat(team.id, 'wins', parseInt(e.target.value) || 0)}
                    className="text-center text-green-600 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Empates</label>
                  <Input
                    type="number"
                    min="0"
                    value={team.draws}
                    onChange={(e) => updateTeamStat(team.id, 'draws', parseInt(e.target.value) || 0)}
                    className="text-center text-yellow-600 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Derrotas</label>
                  <Input
                    type="number"
                    min="0"
                    value={team.losses}
                    onChange={(e) => updateTeamStat(team.id, 'losses', parseInt(e.target.value) || 0)}
                    className="text-center text-red-600 font-semibold"
                  />
                </div>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                Total de jogos: {team.wins + team.draws + team.losses}
              </div>
            </Card>
          ))}
        </div>

        {hasCalculated && weeklyTeams.some(t => t.isWinner) && (
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-lg border border-yellow-300 dark:border-yellow-500">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <Crown className="w-5 h-5" />
              <span className="font-semibold">
                Time Vencedor da Semana: {weeklyTeams.find(t => t.isWinner)?.name}
              </span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};