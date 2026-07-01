import { useQuery } from '@tanstack/react-query';
import productService from '../services/productService';
import type { PagedResult } from '../types/pagination';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAllProducts(),
  });
};

export const useProductsPaged = (page: number, pageSize: number) => {
  return useQuery<PagedResult<any>>({
    queryKey: ['products', 'paged', page, pageSize],
    queryFn: () => productService.getProductsPaged(page, pageSize),
    placeholderData: (prev) => prev,
  });
};

export const useProduct = (id: string | number) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });
};

export const useProductsByCategory = (categoryId: number | null) => {
  return useQuery({
    queryKey: ['products', 'category', categoryId],
    queryFn: () => productService.getProductsByCategory(categoryId),
    enabled: categoryId !== null,
  });
};

export const useLatestProducts = (limit: number) => {
  const query = useProducts();
  return {
    ...query,
    data: query.data?.slice(0, limit) ?? [],
  };
};

export const useBestSellingProducts = (limit: number) => {
  const query = useProducts();
  return {
    ...query,
    data: query.data?.slice(0, limit) ?? [],
  };
};
