import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import orderService from '../services/orderService';
import toast from 'react-hot-toast';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => orderService.submitOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: () => {
      toast.error('An error occurred during the transaction. Please try again.');
    },
  });
};

export const useMyOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getMyOrders,
  });
};

export const useOrderDetail = (id: number) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => orderService.cancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order has been cancelled.');
    },
    onError: () => {
      toast.error('Could not cancel order. Only pending orders can be cancelled.');
    },
  });
};
