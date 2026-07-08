using System.ComponentModel.DataAnnotations;

namespace BETodoList.DTOs
{
    public class TaskDto
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Tiêu đề không được để trống.")]
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Status { get; set; } = "To Do"; // "To Do", "In Progress", "Done"
        public string Priority { get; set; } = "Medium"; // "Low", "Medium", "High"
        public int? CategoryId { get; set; }
        public string? DueDate { get; set; } // Sử dụng kiểu string (format "yyyy-MM-dd") để Frontend dễ truyền nhận từ thẻ <input type="date">
    }

    public class TaskCreateUpdateDto
    {
        [Required(ErrorMessage = "Tiêu đề không được để trống.")]
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Status { get; set; } = "To Do";
        public string Priority { get; set; } = "Medium";
        public int? CategoryId { get; set; }
        public string? DueDate { get; set; }
    }
}