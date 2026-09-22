import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { httpClientRepository } from '../../infra/clients/http-client.repository';
import { ListClientsUseCase } from '../../core/clients/application/list-clients.usecase';
import { CreateClientUseCase } from '../../core/clients/application/create-client.usecase';
import { UpdateClientUseCase } from '../../core/clients/application/update-client.usecase';
import { DeleteClientUseCase } from '../../core/clients/application/delete-client.usecase';
import { RestoreClientUseCase } from '../../core/clients/application/restore-client.usecase';
import type { CreateClientInput, UpdateClientInput } from '../../core/clients/domain/client.repository.interface';

const listClientsUseCase = new ListClientsUseCase(httpClientRepository);
const createClientUseCase = new CreateClientUseCase(httpClientRepository);
const updateClientUseCase = new UpdateClientUseCase(httpClientRepository);
const deleteClientUseCase = new DeleteClientUseCase(httpClientRepository);
const restoreClientUseCase = new RestoreClientUseCase(httpClientRepository);

export function useClients(filter?: { search?: string; tag?: string }) {
  const queryClient = useQueryClient();

  const {
    data: clients = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['clients', filter?.search, filter?.tag],
    queryFn: () => listClientsUseCase.execute(filter),
    staleTime: 1000 * 60, // 1 min
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateClientInput) => createClientUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (input: UpdateClientInput) => updateClientUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteClientUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (id: string) => restoreClientUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  return {
    clients,
    isLoading,
    isError,
    error,
    refetch,
    createClient: (input: CreateClientInput) => createMutation.mutateAsync(input),
    updateClient: (input: UpdateClientInput) => updateMutation.mutateAsync(input),
    deleteClient: (id: string) => deleteMutation.mutateAsync(id),
    restoreClient: (id: string) => restoreMutation.mutateAsync(id),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
