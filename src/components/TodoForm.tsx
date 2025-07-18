import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Sparkles } from 'lucide-react';

interface TodoFormProps {
  onAdd: (message: string, status: string) => void;
}

export const TodoForm = ({ onAdd }: TodoFormProps) => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('Pending');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onAdd(message.trim(), status);
      setMessage('');
      setStatus('Pending');
    }
  };

  return (
    <Card className="shadow-soft border-primary/20 bg-gradient-to-br from-card to-muted/20">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-primary rounded-full">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
              Add New Todo
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What needs to be done?"
                className="bg-background/50 border-primary/30 focus:border-primary focus:ring-primary/20 text-base"
                required
              />
            </div>

            <div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-background/50 border border-primary/30 rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary/20"
              >
                <option value="Pending">Pending</option>
                <option value="In-progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Todo
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};