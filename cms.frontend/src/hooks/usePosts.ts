import { useQuery } from '@tanstack/react-query';
import postService from '../services/postService';
import { useLocale } from '../context/LocaleContext';
import type { PagedResult } from '../types/pagination';

export const usePosts = () =>
  useQuery({ queryKey: ['posts'], queryFn: () => postService.getAllPosts() });

export const usePostsPaged = (page: number, pageSize: number) => {
  const { locale } = useLocale();
  return useQuery<PagedResult<any>>({
    queryKey: ['posts', 'paged', page, pageSize, { locale }],
    queryFn: () => postService.getPostsPaged(page, pageSize, locale),
    placeholderData: (prev) => prev,
  });
};

export const usePost = (id: string | number) =>
  useQuery({ queryKey: ['posts', id], queryFn: () => postService.getPostById(id), enabled: !!id });

export const usePostsByCategory = (categoryId: number | null) =>
  useQuery({
    queryKey: ['posts', 'category', categoryId],
    queryFn: () => postService.getPostsByCategory(categoryId),
    enabled: categoryId !== null,
  });
