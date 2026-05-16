/* Họ tên: Phạm Đức Anh
 * Mã SV: 2123110135
 * Lớp: CCQ2311D
 * Ngày tạo: 16/05/2026
 * Mô tả: tạo thực thể Category
 */


using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } // Tên danh mục (vd: Tin Giáo Dục)
        public string Description { get; set; }

        // Quan hệ: Một danh mục có nhiều bài viết
        public virtual ICollection<Post> Posts { get; set; }
    }
}
