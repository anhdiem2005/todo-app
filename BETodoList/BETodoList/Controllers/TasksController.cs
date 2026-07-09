using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using BETodoList.Data;
using BETodoList.Models;
using BETodoList.DTOs;

namespace BETodoList.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _db;

        public TasksController(AppDbContext db)
        {
            _db = db;
        }
        
        private int? GetCurrentUserId()
        {
            var claim = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub")
                ?? User.FindFirstValue("id")
                ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            return int.TryParse(claim, out var id) ? id : null;
        }

        [HttpGet]
        public async Task<IActionResult> GetTasks()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized(new { message = "User not authenticated." });

            var tasks = await _db.Tasks
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new TaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status, // Sử dụng Status ("To Do", "In Progress", "Done") thay vì IsCompleted
                    Priority = t.Priority,
                    DueDate = t.DueDate.HasValue ? t.DueDate.Value.ToString("yyyy-MM-dd") : null
                })
                .ToListAsync();

            return Ok(tasks);
        }

        // 2. TẠO TASK MỚI (ĐÃ SỬA LỖI DÒNG 55 VÀ 67 - THÊM TASK<> VÀ ĐỒNG BỘ STATUS)
        [HttpPost]
        public async Task<ActionResult<TaskDto>> CreateTask([FromBody] TaskCreateUpdateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest(new { message = "Tiêu đề không được để trống." });

            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized(new { message = "User not authenticated." });

            var task = new TaskItem
            {
                UserId = userId.Value,
                Title = dto.Title.Trim(),
                Description = dto.Description?.Trim(),
                Priority = dto.Priority ?? "Medium",
                Status = dto.Status ?? "To Do", // Khởi tạo mặc định trạng thái chuỗi
                DueDate = DateTime.TryParse(dto.DueDate, out var parsedDate) ? parsedDate : null,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _db.Tasks.Add(task);
            await _db.SaveChangesAsync();

            var result = new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                Priority = task.Priority,
                DueDate = task.DueDate.HasValue ? task.DueDate.Value.ToString("yyyy-MM-dd") : null
            };

            return Ok(result);
        }

        // 3. CẬP NHẬT TASK (ĐÃ SỬA LỖI DÒNG 82)
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskCreateUpdateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest(new { message = "Tiêu đề không được để trống." });

            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized(new { message = "User not authenticated." });

            var task = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (task == null)
                return NotFound(new { message = "Không tìm thấy công việc." });

            // Cập nhật thông tin thực tế khớp cấu trúc Database gốc
            task.Title = dto.Title.Trim();
            task.Description = dto.Description?.Trim();
            task.Status = dto.Status ?? "To Do";
            task.Priority = dto.Priority ?? "Medium";
            task.DueDate = DateTime.TryParse(dto.DueDate, out var parsedDate) ? parsedDate : null;
            task.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            var result = new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                Priority = task.Priority,
                DueDate = task.DueDate.HasValue ? task.DueDate.Value.ToString("yyyy-MM-dd") : null
            };

            return Ok(result);
        }

        // 4. XÓA TASK (ĐÃ SỬA LỖI DÒNG 102)
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized(new { message = "User not authenticated." });

            var task = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (task == null)
                return NotFound(new { message = "Không tìm thấy công việc để xóa." });

            _db.Tasks.Remove(task);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Xóa công việc thành công." });
        }
    }
}