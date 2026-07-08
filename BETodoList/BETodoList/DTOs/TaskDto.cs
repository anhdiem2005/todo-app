using System.ComponentModel.DataAnnotations;

namespace BETodoList.DTOs
{
    public class TaskDto
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Tiêu đề không được để trống.")]
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Status { get; set; } = "To Do";
        public string Priority { get; set; } = "Medium";
        public int? CategoryId { get; set; }
        public string? Category { get; set; } 
        public string? DueDate { get; set; }
        public List<SubtaskDto> Subtasks { get; set; } = new List<SubtaskDto>();
    }

    public class TaskCreateUpdateDto
    {
        [Required(ErrorMessage = "Tiêu đề không được để trống.")]
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Status { get; set; } = "To Do";
        public string Priority { get; set; } = "Medium";
        public int? CategoryId { get; set; }
        public string? Category { get; set; }
        public string? DueDate { get; set; }
        public List<SubtaskCreateUpdateDto> Subtasks { get; set; } = new List<SubtaskCreateUpdateDto>();
    }

    public class SubtaskDto
    {
        public int Id { get; set; }
        public string Label { get; set; } = string.Empty;
        public bool Done { get; set; } 
    }

    public class SubtaskCreateUpdateDto
    {
        [Required]
        public string Label { get; set; } = string.Empty;
        public bool Done { get; set; }
    }
}