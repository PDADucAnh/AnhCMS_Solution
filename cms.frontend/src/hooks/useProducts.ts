import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import productService from '../services/productService';
import toast from 'react-hot-toast';

export const useProducts = () =>
  useQuery({ queryKey: ['products'], queryFn: () => productService.getAllProducts() });

export const useProduct = (id: string | number) =>
  useQuery({ queryKey: ['products', id], queryFn: () => productService.getProductById(id), enabled: !!id });

export const useProductsByCategory = (categoryId: number | null) =>
  useQuery({
    queryKey: ['products', 'category', categoryId],
    queryFn: () => productService.getProductsByCategory(categoryId),
    enabled: categoryId !== null,
  });
