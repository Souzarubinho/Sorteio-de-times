import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, Users, BarChart3 } from "lucide-react";
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

interface TeamStatsData extends Team {
  wins: number;
  draws: number;
  losses: number;
  points: number;
}

interface TeamStatsProps {
  teams: Team[];
  isDrawn: boolean;
}

export const TeamStats = ({ teams, isDrawn }: TeamStatsProps) => {
  const [teamStats, setTeamStats] = useState<TeamStatsData[]>([]);
  const { toast } = useToast();

  // Initialize team stats when teams are drawn
  const initializeStats = () => {
    const initialStats = teams.map(team => ({
      ...team,
      wins: 0,
      draws: 0,
      losses: 0,
      points: 0
    }));
    setTeamStats(initialStats);
    toast({
      title: "Estatísticas inicializadas",
      description: "Agora você pode registrar os resultados dos jogos!",
    });
  };

  const updateTeamStat = (teamIndex: number, field: 'wins' | 'draws' | 'losses', value: number) => {
    const updatedStats = [...teamStats];
    updatedStats[teamIndex] = {
      ...updatedStats[teamIndex],
      [field]: Math.max(0, value)
    };
    
    // Calculate points (3 for win, 1 for draw, 0 for loss)
    const team = updatedStats[teamIndex];
    team.points = (team.wins * 3) + (team.draws * 1);
    
    setTeamStats(updatedStats);
  };

  const calculateWeeklyWinner = () => {
    if (teamStats.length === 0) return;
    
    const sortedTeams = [...teamStats].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return (b.wins + b.draws + b.losses) - (a.wins + a.draws + a.losses);
    });
    
    const winner = sortedTeams[0];
    toast({
      title: "🏆 Time da Semana!",
      description: `${winner.name} é o grande campeão com ${winner.points} pontos!`,
    });
  };

  const resetStats = () => {
    setTeamStats([]);
    toast({
      title: "Estatísticas resetadas",
      description: "Todas as estatísticas foram limpas.",
    });
  };

  if (!isDrawn || teams.length === 0) {
    return (
      <Card className="p-8 text-center bg-card shadow-field">
        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          Nenhum time sorteado
        </h3>
        <p className="text-sm text-muted-foreground">
          Sorteie os times primeiro para gerenciar estatísticas
        </p>
      </Card>
    );
  }

  if (teamStats.length === 0) {
    return (
      <Card className="p-6 bg-card shadow-field">
        <div className="text-center mb-6">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Gerenciar Estatísticas
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Inicialize as estatísticas para começar a registrar vitórias, empates e derrotas
          </p>
          <Button onClick={initializeStats} variant="field" size="lg">
            <BarChart3 className="w-4 h-4 mr-2" />
            Inicializar Estatísticas
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card shadow-field">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Estatísticas dos Times
          </h3>
          <div className="flex gap-2">
            <Button onClick={calculateWeeklyWinner} variant="field" size="sm">
              <Trophy className="w-4 h-4 mr-2" />
              Time da Semana
            </Button>
            <Button onClick={resetStats} variant="outline" size="sm">
              Resetar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamStats.map((team, index) => (
            <Card key={index} className={`p-4 ${team.color === 'a' ? 'bg-team-a/20 border-team-a' : 'bg-team-b/20 border-team-b'}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-4 h-4 rounded-full ${team.color === 'a' ? 'bg-team-a' : 'bg-team-b'}`} />
                <h4 className="font-semibold text-foreground">{team.name}</h4>
                <div className="ml-auto flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="font-bold text-lg">{team.points}pts</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground">Vitórias</label>
                  <Input
                    type="number"
                    min="0"
                    value={team.wins}
                    onChange={(e) => updateTeamStat(index, 'wins', parseInt(e.target.value) || 0)}
                    className="text-center text-green-600 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Empates</label>
                  <Input
                    type="number"
                    min="0"
                    value={team.draws}
                    onChange={(e) => updateTeamStat(index, 'draws', parseInt(e.target.value) || 0)}
                    className="text-center text-yellow-600 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Derrotas</label>
                  <Input
                    type="number"
                    min="0"
                    value={team.losses}
                    onChange={(e) => updateTeamStat(index, 'losses', parseInt(e.target.value) || 0)}
                    className="text-center text-red-600 font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {team.players.length} jogadores
                </div>
                <div>
                  Jogos: {team.wins + team.draws + team.losses}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};