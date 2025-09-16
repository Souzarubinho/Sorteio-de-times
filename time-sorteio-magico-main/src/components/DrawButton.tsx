import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shuffle, Users, TrendingUp } from "lucide-react";

interface Player {
  name: string;
  rating: number;
}

interface DrawButtonProps {
  players: Player[];
  onDraw: (teams: Array<{ name: string; players: Player[]; color: 'a' | 'b'; avgRating: number }>) => void;
  disabled: boolean;
}

export const DrawButton = ({ players, onDraw, disabled }: DrawButtonProps) => {
  const [isDrawing, setIsDrawing] = useState(false);

  const handleDraw = async () => {
    if (players.length < 5) return;

    setIsDrawing(true);

    // Simulate drawing animation
    await new Promise(resolve => setTimeout(resolve, 1500));

    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const playersPerTeam = 5;
    const numberOfTeams = Math.floor(players.length / playersPerTeam);
    
    if (numberOfTeams === 0) {
      setIsDrawing(false);
      return;
    }

    const newTeams = [];

    // Create teams of 5 players each
    for (let i = 0; i < numberOfTeams; i++) {
      const teamPlayers = shuffledPlayers.slice(i * playersPerTeam, (i + 1) * playersPerTeam);
      const avgRating = teamPlayers.reduce((sum, player) => sum + player.rating, 0) / teamPlayers.length;
      
      newTeams.push({
        name: `Time ${i + 1}`,
        players: teamPlayers,
        color: i % 2 === 0 ? 'a' : 'b',
        avgRating: Math.round(avgRating * 10) / 10
      });
    }

    // If there are remaining players (less than 5), distribute them among existing teams
    const remainingPlayers = shuffledPlayers.slice(numberOfTeams * playersPerTeam);
    remainingPlayers.forEach((player, index) => {
      const teamIndex = index % numberOfTeams;
      newTeams[teamIndex].players.push(player);
      
      // Recalculate average rating
      const team = newTeams[teamIndex];
      team.avgRating = Math.round((team.players.reduce((sum, p) => sum + p.rating, 0) / team.players.length) * 10) / 10;
    });

    onDraw(newTeams);
    setIsDrawing(false);
  };

  const canDraw = players.length >= 5;
  const numberOfTeams = Math.floor(players.length / 5);
  const remainingPlayers = players.length % 5;

  return (
    <div className="text-center space-y-4">
      <Button
        onClick={handleDraw}
        disabled={disabled || !canDraw}
        size="lg"
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 min-w-[140px]"
      >
        {isDrawing ? (
          <>
            <Shuffle className="w-4 h-4 animate-spin mr-2" />
            Sorteando...
          </>
        ) : (
          <>
            <Users className="w-4 h-4 mr-2" />
            Sortear Times
          </>
        )}
      </Button>
      
      {players.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {canDraw ? (
            <>
              {numberOfTeams} time{numberOfTeams !== 1 ? 's' : ''} de 5 jogadores
              {remainingPlayers > 0 && (
                <> + {remainingPlayers} jogador{remainingPlayers !== 1 ? 'es' : ''} extra</>
              )}
            </>
          ) : (
            `Adicione pelo menos 5 jogadores para sortear (${players.length}/5)`
          )}
        </div>
      )}
    </div>
  );
};