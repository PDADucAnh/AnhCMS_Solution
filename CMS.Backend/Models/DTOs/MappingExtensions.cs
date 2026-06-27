using System.Collections.Generic;
using System.Linq;
using CMS.Data.Entities;
using CMS.Backend.Models.DTOs;

namespace CMS.Backend.Models.DTOs
{
    public static class MappingExtensions
    {
        // === User Mapping ===
        public static UserDTO ToDTO(this User user)
        {
            if (user == null) return null;
            return new UserDTO
            {
                Id = user.Id,
                Username = user.Username,
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,
                Address = user.Address,
                Role = user.Role
            };
        }

        public static User ToEntity(this CreateUserDTO dto)
        {
            if (dto == null) return null;
            return new User
            {
                Username = dto.Username,
                FullName = dto.FullName,
                Role = dto.Role
            };
        }

        // === Category Mapping ===
        public static CategoryDTO ToDTO(this Category category, string? locale = "en")
        {
            if (category == null) return null;
            var translation = category.Translations?.FirstOrDefault(t => t.Locale == locale);
            return new CategoryDTO
            {
                Id = category.Id,
                Name = translation?.Name ?? "",
                Description = translation?.Description,
                Slug = translation?.Slug,
                Locale = locale ?? "en",
                Posts = category.Posts?.Select(p => p.ToDTO(locale)).ToList()
            };
        }

        public static Category ToEntity(this CreateCategoryDTO dto)
        {
            if (dto == null) return null;
            var category = new Category();
            if (dto.NameEn != null)
            {
                category.Translations.Add(new CategoryTranslation
                {
                    Locale = "en",
                    Name = dto.NameEn,
                    Description = dto.DescriptionEn,
                    Slug = dto.SlugEn
                });
            }
            if (dto.NameVi != null)
            {
                category.Translations.Add(new CategoryTranslation
                {
                    Locale = "vi",
                    Name = dto.NameVi,
                    Description = dto.DescriptionVi,
                    Slug = dto.SlugVi
                });
            }
            return category;
        }

        public static void UpdateEntity(this UpdateCategoryDTO dto, Category entity)
        {
            if (dto == null || entity == null) return;
            UpdateTranslation(entity.Translations, "en", t =>
            {
                t.Name = dto.NameEn;
                t.Description = dto.DescriptionEn;
                t.Slug = dto.SlugEn;
            });
            UpdateTranslation(entity.Translations, "vi", t =>
            {
                t.Name = dto.NameVi;
                t.Description = dto.DescriptionVi;
                t.Slug = dto.SlugVi;
            });
        }

        // === CategoryProduct Mapping ===
        public static CategoryProductDTO ToDTO(this CategoryProduct categoryProduct, string? locale = "en")
        {
            if (categoryProduct == null) return null;
            var translation = categoryProduct.Translations?.FirstOrDefault(t => t.Locale == locale);
            return new CategoryProductDTO
            {
                Id = categoryProduct.Id,
                Name = translation?.Name ?? "",
                Description = translation?.Description,
                Slug = translation?.Slug,
                Locale = locale ?? "en"
            };
        }

        public static CategoryProduct ToEntity(this CreateCategoryProductDTO dto)
        {
            if (dto == null) return null;
            var category = new CategoryProduct();
            if (dto.NameEn != null)
            {
                category.Translations.Add(new CategoryProductTranslation
                {
                    Locale = "en",
                    Name = dto.NameEn,
                    Description = dto.DescriptionEn,
                    Slug = dto.SlugEn
                });
            }
            if (dto.NameVi != null)
            {
                category.Translations.Add(new CategoryProductTranslation
                {
                    Locale = "vi",
                    Name = dto.NameVi,
                    Description = dto.DescriptionVi,
                    Slug = dto.SlugVi
                });
            }
            return category;
        }

        public static void UpdateEntity(this UpdateCategoryProductDTO dto, CategoryProduct entity)
        {
            if (dto == null || entity == null) return;
            UpdateTranslation(entity.Translations, "en", t =>
            {
                t.Name = dto.NameEn;
                t.Description = dto.DescriptionEn;
                t.Slug = dto.SlugEn;
            });
            UpdateTranslation(entity.Translations, "vi", t =>
            {
                t.Name = dto.NameVi;
                t.Description = dto.DescriptionVi;
                t.Slug = dto.SlugVi;
            });
        }

        // === Product Mapping ===
        public static ProductDTO ToDTO(this Product product, string? locale = "en")
        {
            if (product == null) return null;
            var translation = product.Translations?.FirstOrDefault(t => t.Locale == locale);
            return new ProductDTO
            {
                Id = product.Id,
                Name = translation?.Name ?? "",
                Description = translation?.Description,
                Slug = translation?.Slug,
                Locale = locale ?? "en",
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                ImageUrl = product.ImageUrl,
                CategoryProductId = product.CategoryProductId,
                CategoryProductName = product.CategoryProduct?.Translations
                    ?.FirstOrDefault(t => t.Locale == locale)?.Name
            };
        }

        public static Product ToEntity(this CreateProductDTO dto)
        {
            if (dto == null) return null;
            var product = new Product
            {
                Price = dto.Price,
                StockQuantity = dto.StockQuantity,
                ImageUrl = dto.ImageUrl,
                CategoryProductId = dto.CategoryProductId
            };
            if (dto.NameEn != null)
            {
                product.Translations.Add(new ProductTranslation
                {
                    Locale = "en",
                    Name = dto.NameEn,
                    Description = dto.DescriptionEn,
                    Slug = dto.SlugEn
                });
            }
            if (dto.NameVi != null)
            {
                product.Translations.Add(new ProductTranslation
                {
                    Locale = "vi",
                    Name = dto.NameVi,
                    Description = dto.DescriptionVi,
                    Slug = dto.SlugVi
                });
            }
            return product;
        }

        public static void UpdateEntity(this UpdateProductDTO dto, Product entity)
        {
            if (dto == null || entity == null) return;
            entity.Price = dto.Price;
            entity.StockQuantity = dto.StockQuantity;
            entity.ImageUrl = dto.ImageUrl;
            entity.CategoryProductId = dto.CategoryProductId;
            UpdateTranslation(entity.Translations, "en", t =>
            {
                t.Name = dto.NameEn;
                t.Description = dto.DescriptionEn;
                t.Slug = dto.SlugEn;
            });
            UpdateTranslation(entity.Translations, "vi", t =>
            {
                t.Name = dto.NameVi;
                t.Description = dto.DescriptionVi;
                t.Slug = dto.SlugVi;
            });
        }

        // === Customer Mapping ===
        public static CustomerDTO ToDTO(this Customer customer)
        {
            if (customer == null) return null;
            return new CustomerDTO
            {
                Id = customer.Id,
                FullName = customer.FullName,
                Email = customer.Email,
                Phone = customer.Phone,
                Address = customer.Address
            };
        }

        public static Customer ToEntity(this CreateCustomerDTO dto)
        {
            if (dto == null) return null;
            return new Customer
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                Address = dto.Address,
                PasswordHash = dto.PasswordHash
            };
        }

        public static void UpdateEntity(this UpdateCustomerDTO dto, Customer entity)
        {
            if (dto == null || entity == null) return;
            entity.FullName = dto.FullName;
            entity.Email = dto.Email;
            entity.Phone = dto.Phone;
            entity.Address = dto.Address;
            if (!string.IsNullOrEmpty(dto.PasswordHash))
            {
                entity.PasswordHash = dto.PasswordHash;
            }
        }

        // === Order Mapping ===
        public static OrderDTO ToDTO(this Order order)
        {
            if (order == null) return null;

            var details = new List<OrderDetailDTO>();
            if (order.OrderDetails != null)
            {
                foreach (var detail in order.OrderDetails)
                {
                    details.Add(detail.ToDTO());
                }
            }

            return new OrderDTO
            {
                Id = order.Id,
                OrderDate = order.OrderDate,
                CustomerId = order.CustomerId,
                CustomerName = order.Customer?.FullName,
                CustomerEmail = order.Customer?.Email,
                Status = order.Status,
                Notes = order.Notes,
                Currency = order.Currency,
                OrderDetails = details
            };
        }

        public static OrderDetailDTO ToDTO(this OrderDetail detail)
        {
            if (detail == null) return null;
            return new OrderDetailDTO
            {
                Id = detail.Id,
                OrderId = detail.OrderId,
                ProductId = detail.ProductId,
                ProductName = detail.Product != null
                    ? (detail.Product.Translations?.FirstOrDefault(t => t.Locale == "en")?.Name
                       ?? detail.Product.Translations?.FirstOrDefault()?.Name
                       ?? $"Sản phẩm #{detail.Product.Id}")
                    : null,
                ProductImageUrl = detail.Product?.ImageUrl,
                CustomerName = detail.Order?.Customer?.FullName,
                Quantity = detail.Quantity,
                UnitPrice = detail.UnitPrice,
                UnitPriceUsd = detail.UnitPriceUsd,
                Currency = detail.Currency
            };
        }

        public static void UpdateEntity(this UpdateOrderDTO dto, Order entity)
        {
            if (dto == null || entity == null) return;
            entity.CustomerId = dto.CustomerId;
            entity.OrderDate = dto.OrderDate;
            entity.Status = dto.Status;
            entity.Notes = dto.Notes;
        }

        // === Post Mapping ===
        public static PostDTO ToDTO(this Post post, string? locale = "en")
        {
            if (post == null) return null;
            var translation = post.Translations?.FirstOrDefault(t => t.Locale == locale);
            return new PostDTO
            {
                Id = post.Id,
                Title = translation?.Title ?? "",
                Content = translation?.Content ?? "",
                Summary = translation?.Summary,
                Slug = translation?.Slug,
                Locale = locale ?? "en",
                ImageUrl = post.ImageUrl,
                CreatedDate = post.CreatedDate,
                CategoryId = post.CategoryId,
                CategoryName = post.Category?.Translations
                    ?.FirstOrDefault(t => t.Locale == locale)?.Name
            };
        }

        private static string? TruncateSummary(string? summary, string? content)
        {
            const int maxLength = 500;
            var text = !string.IsNullOrWhiteSpace(summary)
                ? summary
                : (content?.Length > 100 ? content.Substring(0, 100) : content);
            return text?.Length > maxLength ? text.Substring(0, maxLength) : text;
        }

        public static Post ToEntity(this CreatePostDTO dto)
        {
            if (dto == null) return null;
            var post = new Post
            {
                ImageUrl = dto.ImageUrl,
                CategoryId = dto.CategoryId
            };
            if (dto.TitleEn != null)
            {
                post.Translations.Add(new PostTranslation
                {
                    Locale = "en",
                    Title = dto.TitleEn,
                    Content = dto.ContentEn,
                    Summary = TruncateSummary(dto.SummaryEn, dto.ContentEn),
                    Slug = dto.SlugEn
                });
            }
            if (dto.TitleVi != null)
            {
                post.Translations.Add(new PostTranslation
                {
                    Locale = "vi",
                    Title = dto.TitleVi,
                    Content = dto.ContentVi,
                    Summary = TruncateSummary(dto.SummaryVi, dto.ContentVi),
                    Slug = dto.SlugVi
                });
            }
            return post;
        }

        public static void UpdateEntity(this UpdatePostDTO dto, Post entity)
        {
            if (dto == null || entity == null) return;
            entity.ImageUrl = dto.ImageUrl;
            entity.CategoryId = dto.CategoryId;
            UpdateTranslation(entity.Translations, "en", t =>
            {
                t.Title = dto.TitleEn;
                t.Content = dto.ContentEn;
                t.Summary = TruncateSummary(dto.SummaryEn, dto.ContentEn);
                t.Slug = dto.SlugEn;
            });
            UpdateTranslation(entity.Translations, "vi", t =>
            {
                t.Title = dto.TitleVi;
                t.Content = dto.ContentVi;
                t.Summary = TruncateSummary(dto.SummaryVi, dto.ContentVi);
                t.Slug = dto.SlugVi;
            });
        }

        // === Helper: Find or Create Translation ===
        private static void UpdateTranslation<T>(ICollection<T> translations, string locale, System.Action<T> update) where T : class, new()
        {
            var translation = translations.FirstOrDefault(t =>
            {
                var prop = t.GetType().GetProperty("Locale");
                return prop != null && (prop.GetValue(t) as string) == locale;
            });
            if (translation == null)
            {
                translation = new T();
                var localeProp = translation.GetType().GetProperty("Locale");
                localeProp?.SetValue(translation, locale);
                translations.Add(translation);
            }
            update(translation);
        }
    }
}
