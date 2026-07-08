using Microsoft.AspNetCore.Mvc;

namespace BETodoList.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
