import { useState, useEffect } from 'react';
import { TodoItem } from './TodoItem';
import { TodoForm } from './TodoForm';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ListTodo, CheckCircle, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Todo {
  id: number;
  message: string;
  status: string;
}

export const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock API endpoints - you can replace these with your actual FastAPI backend
  const API_BASE = 'http://localhost:8000'; // Adjust this to your backend URL

  // Load initial todos
  useEffect(() => {
    // Since your backend doesn't have a GET all todos endpoint,
    // we'll start with the initial todos from your backend
    const initialTodos = [
      { id: 1, message: "Implement new feature", status: "In-progress" },
      { id: 2, message: "Connect Database", status: "In-progress" }
    ];
    setTodos(initialTodos);
  }, []);

  const addTodo = async (message: string, status: string) => {
    setLoading(true);
    try {
      // Generate a new ID (in real app, this would be handled by backend)
      const newId = Math.max(...todos.map(t => t.id), 0) + 1;
      const newTodo = { id: newId, message, status };
      
      const response = await fetch(`${API_BASE}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add todo');
      }
      
      const addedTodo = await response.json();
      setTodos(prev => [...prev, addedTodo]);
      toast({
        title: "Success!",
        description: "Todo added successfully",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add todo",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (id: number, updates: Partial<Todo>) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/todo/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      
      const updatedTodo = await response.json();
      setTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...todo, ...updates } : todo
        )
      );
      toast({
        title: "Updated!",
        description: "Todo updated successfully",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/todo/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      
      setTodos(prev => prev.filter(todo => todo.id !== id));
      toast({
        title: "Deleted!",
        description: "Todo deleted successfully",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusStats = () => {
    const stats = todos.reduce((acc, todo) => {
      const status = todo.status.toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: todos.length,
      pending: stats.pending || 0,
      inProgress: stats['in-progress'] || 0,
      completed: stats.completed || 0
    };
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-primary rounded-full animate-pulse-glow">
              <ListTodo className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Todo App
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Stay organized and productive with your personal task manager
          </p>
        </div>

        {/* Stats */}
        <Card className="bg-gradient-to-r from-card to-muted/20 border-primary/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center space-y-2">
                <div className="p-2 bg-gradient-primary rounded-full w-fit mx-auto">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <p className="text-2xl font-bold text-primary">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
              </div>
              <div className="text-center space-y-2">
                <div className="p-2 bg-gradient-danger rounded-full w-fit mx-auto">
                  <AlertCircle className="w-4 h-4 text-destructive-foreground" />
                </div>
                <p className="text-2xl font-bold text-destructive">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <div className="text-center space-y-2">
                <div className="p-2 bg-gradient-primary rounded-full w-fit mx-auto">
                  <Clock className="w-4 h-4 text-primary-foreground" />
                </div>
                <p className="text-2xl font-bold text-primary">{stats.inProgress}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
              <div className="text-center space-y-2">
                <div className="p-2 bg-gradient-success rounded-full w-fit mx-auto">
                  <CheckCircle className="w-4 h-4 text-success-foreground" />
                </div>
                <p className="text-2xl font-bold text-success">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Todo Form */}
        <TodoForm onAdd={addTodo} />

        {/* Todo List */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold">Your Tasks</h2>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
            </Badge>
          </div>
          
          {todos.length === 0 ? (
            <Card className="border-dashed border-2 border-muted-foreground/20">
              <CardContent className="p-12 text-center">
                <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-4">
                  <ListTodo className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
                <p className="text-muted-foreground">Add your first todo to get started!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={updateTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};