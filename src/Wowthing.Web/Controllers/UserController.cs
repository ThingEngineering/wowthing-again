using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Wowthing.Web.Controllers
{
    public class UserController : Controller
    {
        [HttpGet("user/{username:minlength(4)}")]
        public IActionResult Index()
        {
            return NotFound();
        }
    }
}
