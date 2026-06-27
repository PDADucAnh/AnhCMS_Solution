import { useQuery } from '@tanstack/react-query';
import productService from '../services/productService';
import { useLocale } from '../context/LocaleContext';

export const useProducts = () => {
  const { locale, currency } = useLocale();
  return useQuery({
    queryKey: ['products', { locale, currency }],
    queryFn: () => productService.getAllProducts({ locale, currency }),
  });
};

export const useProduct = (id: string | number) => {
  const { locale, currency } = useLocale();
  return useQuery({
    queryKey: ['products', id, { locale, currency }],
    queryFn: () => productService.getProductById(id, { locale, currency }),
    enabled: !!id,
  });
};

export const useProductsByCategory = (categoryId: number | null) => {
  const { locale, currency } = useLocale();
  return useQuery({
    queryKey: ['products', 'category', categoryId, { locale, currency }],
    queryFn: () => productService.getProductsByCategory(categoryId, { locale, currency }),
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
