using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using YouthActionDotNet.Control;
using YouthActionDotNet.DAL;
using YouthActionDotNet.Data;
using YouthActionDotNet.Models;

namespace YouthActionDotNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimelineController : ControllerBase, IUserInterfaceCRUD<Timeline>
    {
        private TimelineControl projectControl;
        JsonSerializerSettings settings = new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore };

        public TimelineController(DBContext context)
        {
            projectControl = new TimelineControl(context);
        }

        public bool Exists(string id)
        {
            return projectControl.Get(id) != null;
        }

        [HttpPost("Create")]
        public async Task<ActionResult<string>> Create(Timeline template)
        {
            return await projectControl.Create(template);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<string>> Get(string id)
        {
            return await projectControl.Get(id);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<string>> Update(string id, Timeline template)
        {
            return await projectControl.Update(id, template);
        }

        [HttpPut("UpdateAndFetch/{id}")]
        public async Task<ActionResult<string>> UpdateAndFetchAll(string id, Timeline template)
        {
            return await projectControl.UpdateAndFetchAll(id, template);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<ActionResult<string>> Delete(string id)
        {
            return await projectControl.Delete(id);
        }

        [HttpDelete("Delete")]
        public async Task<ActionResult<string>> Delete(Timeline template)
        {
            return await projectControl.Delete(template);
        }

        [HttpGet("All")]
        public async Task<ActionResult<string>> All()
        {
            return await projectControl.All();
        }

        [HttpGet("Settings")]
        public string Settings()
        {
            return projectControl.Settings();
        }
    }
}