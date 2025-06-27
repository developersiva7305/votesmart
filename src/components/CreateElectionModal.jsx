import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { X, Plus, Trash2, Calendar, Users, Save } from 'lucide-react';

const CreateElectionModal = ({ onClose, onSubmit, electionToEdit }) => {
  const initialCandidate = () => ({ id: Date.now().toString(), name: '', position: '', manifesto: '' });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    candidates: [initialCandidate()]
  });

  useEffect(() => {
    if (electionToEdit) {
      setFormData({
        ...electionToEdit,
        startDate: electionToEdit.startDate ? new Date(electionToEdit.startDate).toISOString().substring(0, 16) : '',
        endDate: electionToEdit.endDate ? new Date(electionToEdit.endDate).toISOString().substring(0, 16) : '',
        candidates: electionToEdit.candidates.length > 0 ? electionToEdit.candidates : [initialCandidate()]
      });
    } else {
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        candidates: [initialCandidate()]
      });
    }
  }, [electionToEdit]);

  const addCandidate = () => {
    setFormData(prev => ({
      ...prev,
      candidates: [...prev.candidates, initialCandidate()]
    }));
  };

  const removeCandidate = (id) => {
    if (formData.candidates.length > 1) {
      setFormData(prev => ({
        ...prev,
        candidates: prev.candidates.filter(c => c.id !== id)
      }));
    } else {
        toast({
            title: "Cannot Remove",
            description: "At least one candidate is required for an election.",
            variant: "destructive"
        });
    }
  };

  const updateCandidate = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      candidates: prev.candidates.map(c =>
        c.id === id ? { ...c, [field]: value } : c
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.startDate || !formData.endDate) {
      toast({ title: "Missing Information", description: "Please fill in all election details.", variant: "destructive" });
      return;
    }
    if (formData.candidates.some(c => !c.name || !c.position)) {
      toast({ title: "Incomplete Candidates", description: "Please fill in name and position for all candidates.", variant: "destructive" });
      return;
    }
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast({ title: "Invalid Dates", description: "End date must be after start date.", variant: "destructive" });
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        <Card className="voting-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl gradient-text">{electionToEdit ? "Edit Election" : "Create New Election"}</CardTitle>
            <Button onClick={onClose} variant="ghost" size="icon" className="hover:bg-gray-100"><X className="h-4 w-4" /></Button>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Election Title</Label>
                  <Input id="title" placeholder="e.g., Student Council President 2024" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Brief description" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date & Time</Label>
                  <Input id="startDate" type="datetime-local" value={formData.startDate} onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date & Time</Label>
                  <Input id="endDate" type="datetime-local" value={formData.endDate} onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center"><Users className="mr-2 h-5 w-5" />Candidates</h3>
                  <Button type="button" onClick={addCandidate} variant="outline" size="sm"><Plus className="mr-2 h-4 w-4" />Add Candidate</Button>
                </div>
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {formData.candidates.map((candidate, index) => (
                    <motion.div key={candidate.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Candidate {index + 1}</h4>
                        <Button type="button" onClick={() => removeCandidate(candidate.id)} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2"><Label>Name</Label><Input placeholder="Candidate name" value={candidate.name} onChange={(e) => updateCandidate(candidate.id, 'name', e.target.value)} /></div>
                        <div className="space-y-2"><Label>Position</Label><Input placeholder="e.g., President" value={candidate.position} onChange={(e) => updateCandidate(candidate.id, 'position', e.target.value)} /></div>
                        <div className="space-y-2 md:col-span-2"><Label>Manifesto (Optional)</Label><Input placeholder="Brief manifesto" value={candidate.manifesto} onChange={(e) => updateCandidate(candidate.id, 'manifesto', e.target.value)} /></div>
                      </div>
                    </motion.div>
                  ))}
                  {formData.candidates.length === 0 && (<p className="text-sm text-gray-500 text-center py-4">No candidates added yet.</p>)}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" onClick={onClose} variant="outline">Cancel</Button>
                <Button type="submit" className="admin-gradient text-white">
                  {electionToEdit ? <Save className="mr-2 h-4 w-4" /> : <Calendar className="mr-2 h-4 w-4" />}
                  {electionToEdit ? "Save Changes" : "Create Election"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default CreateElectionModal;