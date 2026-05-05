import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTeam } from '@/hooks/useTeam';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CreateTeamPage() {
  const navigate = useNavigate();
  const { createNewTeam, isLoading, error, clearError } = useTeam();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    clearError();

    if (!formData.name.trim()) {
      setFormError('Team name is required');
      return;
    }

    if (formData.name.length > 100) {
      setFormError('Team name must be less than 100 characters');
      return;
    }

    if (formData.description && formData.description.length > 500) {
      setFormError('Description must be less than 500 characters');
      return;
    }

    try {
      const teamId = await createNewTeam({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      });

      if (teamId) {
        navigate('/teams');
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create team');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formError) setFormError('');
  };

  if (isLoading) {
    return <LoadingSpinner message="Creating your team..." />;
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/hero-2.png"
          alt="Fitness background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/80 to-black/70" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <Link 
              to="/teams" 
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Teams
            </Link>
            
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-white font-pacifico">
                Create New Team
              </h1>
            </div>
            <p className="text-gray-300 font-manrope">
              Start your own team and invite friends to compete in monthly challenges.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Team Details</CardTitle>
              <CardDescription>
                Choose a name and description for your team. You can always edit these later.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Team Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter team name"
                    maxLength={100}
                    disabled={isLoading}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.name.length}/100 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your team's goals or motivation..."
                    maxLength={500}
                    disabled={isLoading}
                    className="mt-1"
                    rows={3}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.description.length}/500 characters
                  </p>
                </div>

                {(error || formError) && (
                  <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                    {error || formError}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/teams')}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.name.trim()}
                    className="flex-1"
                  >
                    {isLoading ? 'Creating...' : 'Create Team'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
