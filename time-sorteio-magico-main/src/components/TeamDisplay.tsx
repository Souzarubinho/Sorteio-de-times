import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/StarRating";
import { Users, Trophy, TrendingUp } from "lucide-react";

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

interface TeamDisplayProps {
  teams: Team[];
  isDrawn: boolean;
}

export const TeamDisplay = ({ teams, isDrawn }: TeamDisplayProps) => {
  if (!isDrawn || teams.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
      {teams.map((team, index) => (
        <Card
          key={index}
          className={`p-6 relative overflow-hidden transition-bounce hover:scale-105 ${
            team.color === 'a' 
              ? 'border-team-a bg-gradient-to-br from-card to-team-a/10' 
              : 'border-team-b bg-gradient-to-br from-card to-team-b/10'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full ${
                  team.color === 'a' ? 'bg-team-a' : 'bg-team-b'
                }`}
              />
              <h3 className="text-xl font-bold text-foreground">{team.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {team.players.length}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {team.avgRating.toFixed(1)}★
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            {team.players.map((player, playerIndex) => (
              <div
                key={playerIndex}
                className="flex items-center justify-between p-3 bg-background/50 rounded-lg animate-fade-in"
                style={{ animationDelay: `${playerIndex * 0.1}s` }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      team.color === 'a' ? 'bg-team-a' : 'bg-team-b'
                    }`}
                  />
                  <span className="text-sm font-medium text-foreground">{player.name}</span>
                </div>
                <StarRating rating={player.rating} readonly size="sm" />
              </div>
            ))}
          </div>

          {/* Team icon overlay */}
          <div className="absolute top-2 right-2 opacity-10">
            <Trophy
              className={`w-12 h-12 ${
                team.color === 'a' ? 'text-team-a' : 'text-team-b'
              }`}
            />
          </div>
        </Card>
      ))}
    </div>
  );
};