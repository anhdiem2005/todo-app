using BETodoList.Data;
using BETodoList.DTOs;
using BETodoList.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;

namespace BETodoList.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _db;

        public TasksController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetTasks()
        {
            var userId = GetCurrentUserId();
            if (userId is null)
                return Unauthorized(new { message = "User not authenticated." });

            var tasks = await _db.Tasks
                .Where(t => t.UserId == userId)
                .Include(t => t.Category)
                .Include(t => t.Subtasks)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            var dto = tasks.Select(MapToDto).ToList();
            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] TaskCreateUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetCurrentUserId();
            if (userId is null)
                return Unauthorized(new { message = "User not authenticated." });

            var category = await GetOrCreateCategoryAsync(userId.Value, dto.Category);

            var task = new TaskItem
            {
                UserId = userId.Value,
                CategoryId = category?.Id,
                Title = dto.Title.Trim(),
                Description = dto.Description?.Trim(),
                Priority = NormalizePriority(dto.Priority),
                Status = NormalizeStatus(dto.Status),
                DueDate = ParseDueDate(dto.DueDate),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Subtasks = new List<SubtaskItem>()
            };

            if (dto.Subtasks != null)
            {
                task.Subtasks = dto.Subtasks
                    .Where(s => !string.IsNullOrWhiteSpace(s.Label))
                    .Select(s => new SubtaskItem
                    {
                        Label = s.Label.Trim(),
                        IsDone = s.Done,
                        CreatedAt = DateTime.UtcNow
                    })
                    .ToList();
            }

            _db.Tasks.Add(task);
            await _db.SaveChangesAsync();

            var created = await _db.Tasks
                .Include(t => t.Category)
                .Include(t => t.Subtasks)
                .FirstOrDefaultAsync(t => t.Id == task.Id);

            return Ok(MapToDto(created!));
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskCreateUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetCurrentUserId();
            if (userId is null)
                return Unauthorized(new { message = "User not authenticated." });

            var task = await _db.Tasks
                .Include(t => t.Subtasks)
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (task is null)
                return NotFound(new { message = "Task not found." });

            var category = await GetOrCreateCategoryAsync(userId.Value, dto.Category);

            task.Title = dto.Title.Trim();
            task.Description = dto.Description?.Trim();
            task.CategoryId = category?.Id;
            task.Priority = NormalizePriority(dto.Priority);
            task.Status = NormalizeStatus(dto.Status);
            task.DueDate = ParseDueDate(dto.DueDate);
            task.UpdatedAt = DateTime.UtcNow;

            _db.Subtasks.RemoveRange(task.Subtasks);
            task.Subtasks = (dto.Subtasks ?? new List<SubtaskInputDto>())
                .Where(s => !string.IsNullOrWhiteSpace(s.Label))
                .Select(s => new SubtaskItem
                {
                    Label = s.Label.Trim(),
                    IsDone = s.Done,
                    CreatedAt = DateTime.UtcNow
                })
                .ToList();

            await _db.SaveChangesAsync();

            var updated = await _db.Tasks
                .Include(t => t.Category)
                .Include(t => t.Subtasks)
                .FirstOrDefaultAsync(t => t.Id == id);

            return Ok(MapToDto(updated!));
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var userId = GetCurrentUserId();
            if (userId is null)
                return Unauthorized(new { message = "User not authenticated." });

            var task = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (task is null)
                return NotFound(new { message = "Task not found." });

            _db.Tasks.Remove(task);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Task deleted successfully." });
        }

        private int? GetCurrentUserId()
        {
            var claim = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                ?? User.FindFirstValue("sub");

            return int.TryParse(claim, out var id) ? id : null;
        }

        private async Task<Category?> GetOrCreateCategoryAsync(int userId, string? categoryName)
        {
            if (string.IsNullOrWhiteSpace(categoryName))
                return null;

            var normalizedName = categoryName.Trim();
            var existing = await _db.Categories.FirstOrDefaultAsync(c => c.UserId == userId && c.Name == normalizedName);
            if (existing is not null)
                return existing;

            var category = new Category
            {
                UserId = userId,
                Name = normalizedName,
                Color = "#3B82F6",
                CreatedAt = DateTime.UtcNow
            };

            _db.Categories.Add(category);
            await _db.SaveChangesAsync();
            return category;
        }

        private static string NormalizePriority(string? priority)
        {
            return priority?.Trim().ToLowerInvariant() switch
            {
                "high" => "High",
                "low" => "Low",
                _ => "Medium"
            };
        }

        private static string NormalizeStatus(string? status)
        {
            return status?.Trim().ToLowerInvariant() switch
            {
                "done" => "Done",
                "in progress" => "In Progress",
                "in_progress" => "In Progress",
                "to do" => "To Do",
                _ => "To Do"
            };
        }

        private static DateTime? ParseDueDate(string? dueDate)
        {
            if (string.IsNullOrWhiteSpace(dueDate))
                return null;

            return DateTime.TryParse(dueDate, out var parsed) ? parsed : null;
        }

        private static TaskDto MapToDto(TaskItem task)
        {
            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Category = task.Category?.Name ?? "General",
                Priority = task.Priority,
                Status = task.Status,
                DueDate = task.DueDate?.ToString("yyyy-MM-dd"),
                Subtasks = task.Subtasks.Select(s => new SubtaskDto
                {
                    Label = s.Label,
                    Done = s.IsDone
                }).ToList()
            };
        }
    }
}
