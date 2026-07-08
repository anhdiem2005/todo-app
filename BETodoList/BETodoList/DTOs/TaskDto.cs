using System.ComponentModel.DataAnnotations;

namespace BETodoList.DTOs
{
    public class TaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Category { get; set; } = "General";
        public string Priority { get; set; } = "Medium";
        public string Status { get; set; } = "To Do";
        public string? DueDate { get; set; }
        public List<SubtaskDto> Subtasks { get; set; } = new();
    }

    public class SubtaskDto
    {
        public string Label { get; set; } = string.Empty;
        public bool Done { get; set; }
    }

    public class TaskCreateUpdateDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string? Category { get; set; }

        public string Priority { get; set; } = "Medium";

        public string Status { get; set; } = "To Do";

        public string? DueDate { get; set; }

        public List<SubtaskInputDto>? Subtasks { get; set; }
    }

    public class SubtaskInputDto
    {
        public string Label { get; set; } = string.Empty;
        public bool Done { get; set; }
    }
}
