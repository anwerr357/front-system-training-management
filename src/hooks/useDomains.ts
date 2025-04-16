
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  getAllDomains, 
  createDomain, 
  updateDomain, 
  deleteDomain,
  getDomainTrainings
} from '@/api/domains';
import { DomainFormData } from '@/types/domain';

export function useDomains() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const domains = useQuery({
    queryKey: ['domains'],
    queryFn: getAllDomains
  });

  const createDomainMutation = useMutation({
    mutationFn: (data: DomainFormData) => createDomain(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      toast({
        title: "Success",
        description: "Domain created successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create domain",
        variant: "destructive"
      });
    }
  });

  const updateDomainMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: DomainFormData }) => 
      updateDomain(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      toast({
        title: "Success",
        description: "Domain updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update domain",
        variant: "destructive"
      });
    }
  });

  const deleteDomainMutation = useMutation({
    mutationFn: (id: number) => deleteDomain(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      toast({
        title: "Success",
        description: "Domain deleted successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete domain",
        variant: "destructive"
      });
    }
  });

  const getDomainTrainingsQuery = (domainId: number) => useQuery({
    queryKey: ['domainTrainings', domainId],
    queryFn: () => getDomainTrainings(domainId),
    enabled: !!domainId
  });

  return {
    domains,
    createDomain: createDomainMutation.mutate,
    updateDomain: updateDomainMutation.mutate,
    deleteDomain: deleteDomainMutation.mutate,
    isLoading: domains.isLoading || 
               createDomainMutation.isPending || 
               updateDomainMutation.isPending || 
               deleteDomainMutation.isPending,
    getDomainTrainings: getDomainTrainingsQuery
  };
}
