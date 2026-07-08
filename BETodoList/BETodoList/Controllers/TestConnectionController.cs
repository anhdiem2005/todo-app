using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Microsoft.Extensions.Configuration;

namespace BETodoList.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestConnectionController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<TestConnectionController> _logger;

        public TestConnectionController(IConfiguration configuration, ILogger<TestConnectionController> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        /// <summary>
        /// GET api/testconnection/db
        /// Kiểm tra kết nối backend ↔ database MySQL
        /// </summary>
        [HttpGet("db")]
        public async Task<IActionResult> TestDatabase()
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            if (string.IsNullOrEmpty(connectionString))
            {
                return StatusCode(500, new
                {
                    status = "Error",
                    message = "Connection string 'DefaultConnection' không tìm thấy trong appsettings.json"
                });
            }

            try
            {
                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                // Lấy thêm thông tin từ DB để xác nhận kết nối thành công
                using var command = new MySqlCommand("SELECT VERSION(), DATABASE(), NOW()", connection);
                using var reader = await command.ExecuteReaderAsync();

                string dbVersion = "", dbName = "", dbTime = "";
                if (await reader.ReadAsync())
                {
                    dbVersion = reader.GetString(0);
                    dbName = reader.IsDBNull(1) ? "(chưa chọn database)" : reader.GetString(1);
                    dbTime = reader.GetDateTime(2).ToString("yyyy-MM-dd HH:mm:ss");
                }

                _logger.LogInformation("Database connection test PASSED at {Time}", DateTime.UtcNow);

                return Ok(new
                {
                    status = "Connected",
                    message = "✅ Kết nối database thành công!",
                    details = new
                    {
                        mysqlVersion = dbVersion,
                        database = dbName,
                        serverTime = dbTime,
                        testedAt = DateTime.UtcNow
                    }
                });
            }
            catch (MySqlException ex)
            {
                _logger.LogError(ex, "Database connection test FAILED");

                return StatusCode(500, new
                {
                    status = "Failed",
                    message = "❌ Kết nối database thất bại!",
                    error = ex.Message,
                    errorCode = ex.Number,
                    hint = GetHint(ex.Number)
                });
            }
        }

        /// <summary>
        /// Gợi ý lỗi dựa theo MySQL error code
        /// </summary>
        private static string GetHint(int errorCode) => errorCode switch
        {
            1045 => "Sai username hoặc password. Kiểm tra lại Uid và Pwd trong appsettings.json",
            1049 => "Database không tồn tại. Hãy tạo database hoặc kiểm tra tên Database trong connection string",
            0    => "Không kết nối được server. Kiểm tra Server, Port và MySQL có đang chạy không",
            _    => $"MySQL error code: {errorCode}. Xem thêm tại https://dev.mysql.com/doc/mysql-errors/8.0/en/server-error-reference.html"
        };
    }
}
