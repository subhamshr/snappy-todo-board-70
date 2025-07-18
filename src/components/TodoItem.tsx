import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Check, X, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Todo {
  id: number;
  message: string;
  status: string;
}

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: number, updates: Partial<Todo>) => void;
  onDelete: (id: number) => void;
}

export const TodoItem = ({ todo, onUpdate, onDelete }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editMessage, setEditMessage] = useState(todo.message);
  const [editStatus, setEditStatus] = useState(todo.status);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-gradient-success text-success-foreground';
      case 'in-progress':
        return 'bg-gradient-primary text-primary-foreground';
      case 'pending':
        return 'bg-gradient-danger text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleSave = () => {
    onUpdate(todo.id, { message: editMessage, status: editStatus });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditMessage(todo.message);
    setEditStatus(todo.status);
    setIsEditing(false);
  };

  const toggleStatus = () => {
    const statusCycle = ['Pending', 'In-progress', 'Completed'];
    const currentIndex = statusCycle.findIndex(s => s.toLowerCase() === todo.status.toLowerCase());
    const nextIndex = (currentIndex + 1) % statusCycle.length;
    onUpdate(todo.id, { status: statusCycle[nextIndex] });
  };

  return (
    <Card className="group hover:shadow-todo transition-all duration-300 animate-fade-in border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Status indicator */}
          <button
            onClick={toggleStatus}
            className="flex-shrink-0 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
          >
            {getStatusIcon(todo.status)}
          </button>

          {/* Content */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  className="bg-muted/50 border-border/50"
                  placeholder="Todo message..."
                />
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-muted/50 border border-border/50 rounded-md text-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="In-progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            ) : (
              <div className="space-y-2">
                <p className={cn(
                  "text-sm font-medium",
                  todo.status.toLowerCase() === 'completed' && "line-through text-muted-foreground"
                )}>
                  {todo.message}
                </p>
                <Badge className={cn("text-xs", getStatusColor(todo.status))}>
                  {getStatusIcon(todo.status)}
                  <span className="ml-1">{todo.status}</span>
                </Badge>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSave}
                  className="text-success hover:text-success hover:bg-success/10"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(todo.id)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};