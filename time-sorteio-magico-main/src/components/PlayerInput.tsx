import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/StarRating";
import { Plus, X, Edit3, UserPlus, Search } from "lucide-react";

const SUGGESTED_PLAYERS = [
  "Rubens", "Felipe Nobre", "Yuri Cocô", "Guimaraes", "Bruno", "Roceiro", 
  "Foguete no Rabo", "Oliveira", "Paraíba", "Barra", "Pato", "Pedro Gordão",
  "Marcao", "Branco", "Renan", "Lucas Andrew", "Rodrigo China", "Yuri nobre", 
  "Valtinho", "Everton Cetão", "Yuri Moura", "Vitor convidado", "Bruno Nogueira", 
  "Juninho", "Lucas Almeida", "Marcos Paulo", "MTS", "Felipe Safanhoto", 
  "Amigo marquinhos", "João"
];

interface Player {
  name: string;
  rating: number;
}

interface PlayerInputProps {
  players: Player[];
  onAddPlayer: (player: Player) => void;
  onRemovePlayer: (index: number) => void;
  onUpdatePlayer: (index: number, player: Player) => void;
}

export const PlayerInput = ({ players, onAddPlayer, onRemovePlayer, onUpdatePlayer }: PlayerInputProps) => {
  const [playerName, setPlayerName] = useState("");
  const [playerRating, setPlayerRating] = useState(3);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [useRatings, setUseRatings] = useState(false);
  const [editingSuggestion, setEditingSuggestion] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim() && !players.some(p => p.name === playerName.trim())) {
      onAddPlayer({ name: playerName.trim(), rating: useRatings ? playerRating : 3 });
      setPlayerName("");
      setPlayerRating(3);
    }
  };

  const handleSuggestionAdd = (name: string) => {
    if (!players.some(p => p.name === name)) {
      onAddPlayer({ name, rating: useRatings ? playerRating : 3 });
    }
  };

  const handleSuggestionEdit = (originalName: string) => {
    setEditingSuggestion(originalName);
    setEditedName(originalName);
  };

  const handleSaveEdit = () => {
    if (editedName.trim() && !players.some(p => p.name === editedName.trim())) {
      onAddPlayer({ name: editedName.trim(), rating: useRatings ? playerRating : 3 });
      setEditingSuggestion(null);
      setEditedName("");
    }
  };

  const handleCancelEdit = () => {
    setEditingSuggestion(null);
    setEditedName("");
  };

  const handleEditPlayer = (index: number, newRating: number) => {
    const player = players[index];
    onUpdatePlayer(index, { ...player, rating: newRating });
    setEditingIndex(null);
  };

  const filteredSuggestions = SUGGESTED_PLAYERS.filter(player =>
    player.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !players.some(p => p.name.toLowerCase() === player.toLowerCase())
  );

  return (
    <Card className="p-6 space-y-4 bg-card shadow-field animate-fade-in">
      <h2 className="text-xl font-semibold text-foreground">Adicionar Jogadores</h2>
      
      <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg mb-3">
        <Label htmlFor="use-ratings" className="text-sm font-medium text-secondary-foreground">
          Usar sistema de níveis:
        </Label>
        <Switch
          id="use-ratings"
          checked={useRatings}
          onCheckedChange={setUseRatings}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Nome do jogador..."
            className="flex-1"
          />
          <Button type="submit" variant="field" size="lg">
            <Plus className="w-4 h-4" />
            Adicionar
          </Button>
        </div>
        
        {useRatings && (
          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
            <span className="text-sm font-medium text-secondary-foreground">Nível:</span>
            <StarRating 
              rating={playerRating}
              onRatingChange={setPlayerRating}
            />
            <span className="text-xs text-muted-foreground">({playerRating} estrela{playerRating !== 1 ? 's' : ''})</span>
          </div>
        )}
      </form>

      {players.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-muted-foreground">
            Jogadores ({players.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
            {players.map((player, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 p-3 bg-secondary rounded-lg animate-fade-in hover:bg-secondary/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-foreground">{player.name}</span>
                  <Button
                    onClick={() => onRemovePlayer(index)}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                
                {useRatings && (
                  <div className="flex items-center justify-between">
                    <StarRating 
                      rating={player.rating}
                      onRatingChange={(newRating) => handleEditPlayer(index, newRating)}
                      size="sm"
                    />
                    <Button
                      onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sugestões de Jogadores */}
      <div className="space-y-3">
        <h3 className="font-medium text-muted-foreground flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Sugestões de Jogadores
        </h3>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Pesquisar jogador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {filteredSuggestions.map((suggestedName) => {
            const isAlreadyAdded = false; // Already filtered out
            const isEditing = editingSuggestion === suggestedName;
            
            if (isEditing) {
              return (
                <div key={suggestedName} className="flex gap-1">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-xs flex-1"
                    autoFocus
                  />
                  <Button
                    onClick={handleSaveEdit}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-green-600"
                  >
                    ✓
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600"
                  >
                    ✗
                  </Button>
                </div>
              );
            }
            
            return (
              <div key={suggestedName} className="flex gap-1">
                <Button
                  onClick={() => handleSuggestionAdd(suggestedName)}
                  variant="outline"
                  size="sm"
                  className={`flex-1 text-xs ${isAlreadyAdded ? 'opacity-50 cursor-not-allowed' : 'hover:bg-field hover:text-field-foreground'}`}
                  disabled={isAlreadyAdded}
                >
                  {suggestedName}
                </Button>
                <Button
                  onClick={() => handleSuggestionEdit(suggestedName)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};