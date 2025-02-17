using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using YouthActionDotNet.Controllers;
using YouthActionDotNet.DAL;
using YouthActionDotNet.Data;
using YouthActionDotNet.Models;

namespace YouthActionDotNet.Control
{
    public class ProjectControl : IUserInterfaceCRUD<Project>
    {
        private GenericRepositoryIn<Project> ProjectRepositoryIn;
        private GenericRepositoryOut<Project> ProjectRepositoryOut;
        private GenericRepositoryIn<ServiceCenter> ServiceCenterRepositoryIn;
        private GenericRepositoryOut<ServiceCenter> ServiceCenterRepositoryOut;
        private GenericRepositoryIn<Timeline> TimelineRepositoryIn;
        private GenericRepositoryIn<Budget> BudgetRepositoryIn;
        //-------------------------------------------------TO BE UPDATED------------------------------------------------//
        private ProjectRepositoryIn ProjectsRepositoryIn;
        private ProjectRepositoryOut ProjectsRepositoryOut;
        //-------------------------------------------------TO BE UPDATED------------------------------------------------//
        JsonSerializerSettings settings = new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore };

        public ProjectControl(DBContext context)
        {
            //-------------------------------------------------TO BE UPDATED------------------------------------------------//
            ProjectsRepositoryIn = new ProjectRepositoryIn(context);
            ProjectsRepositoryOut = new ProjectRepositoryOut(context);
            //-------------------------------------------------TO BE UPDATED------------------------------------------------//
            ProjectRepositoryIn = new GenericRepositoryIn<Project>(context);
            ProjectRepositoryOut = new GenericRepositoryOut<Project>(context);
            ServiceCenterRepositoryIn = new GenericRepositoryIn<ServiceCenter>(context);
            ServiceCenterRepositoryOut = new GenericRepositoryOut<ServiceCenter>(context);
            TimelineRepositoryIn = new GenericRepositoryIn<Timeline>(context);
            BudgetRepositoryIn = new GenericRepositoryIn<Budget>(context);
        }

        public bool Exists(string id)
        {
            return ProjectRepositoryOut.GetByID(id) != null;
        }

        public async Task<ActionResult<string>> Create(Project template)
        {
            Timeline timeline = new Timeline();
            Budget budget = new Budget();
            template.TimelineId = timeline.TimelineId;
            template.BudgetId = budget.BudgetId;
            template.Timeline = timeline;
            template.Budget = budget;
            await TimelineRepositoryIn.InsertAsync(timeline);
            await BudgetRepositoryIn.InsertAsync(budget);
            var project = await ProjectRepositoryIn.InsertAsync(template);
            return JsonConvert.SerializeObject(new { success = true, message = "Project Created", data = project }, settings);
        }

        public async Task<ActionResult<string>> Get(string id)
        {
            var project = await ProjectRepositoryOut.GetByIDAsync(id);
            if (project == null)
            {
                return JsonConvert.SerializeObject(new { success = false, message = "Project Not Found" });
            }
            return JsonConvert.SerializeObject(new { success = true, data = project, message = "Project Successfully Retrieved" });
        }

        public async Task<ActionResult<string>> Update(string id, Project template)
        {
            if (id != template.ProjectId)
            {
                return JsonConvert.SerializeObject(new { success = false, data = "", message = "Project Id Mismatch" });
            }
            await ProjectRepositoryIn.UpdateAsync(template);
            try
            {
                return JsonConvert.SerializeObject(new { success = true, data = template, message = "Project Successfully Updated" });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Exists(id))
                {
                    return JsonConvert.SerializeObject(new { success = false, data = "", message = "Project Not Found" });
                }
                else
                {
                    throw;
                }
            }
        }

        public async Task<ActionResult<string>> UpdateAndFetchAll(string id, Project template)
        {
            if (id != template.ProjectId)
            {
                return JsonConvert.SerializeObject(new { success = false, data = "", message = "Project Id Mismatch" });
            }
            await ProjectRepositoryIn.UpdateAsync(template);
            try
            {
                var projects = await ProjectRepositoryOut.GetAllAsync();
                return JsonConvert.SerializeObject(new { success = true, data = projects, message = "Project Successfully Updated" });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Exists(id))
                {
                    return JsonConvert.SerializeObject(new { success = false, data = "", message = "Project Not Found" });
                }
                else
                {
                    throw;
                }
            }
        }

        public async Task<ActionResult<string>> Delete(string id)
        {
            var project = await ProjectRepositoryOut.GetByIDAsync(id);
            if (project == null)
            {
                return JsonConvert.SerializeObject(new { success = false, data = "", message = "Project Not Found" });
            }
            await BudgetRepositoryIn.DeleteAsync(project.BudgetId);
            await TimelineRepositoryIn.DeleteAsync(project.TimelineId);
            await ProjectRepositoryIn.DeleteAsync(id);
            return JsonConvert.SerializeObject(new { success = true, data = "", message = "Project Successfully Deleted" });
        }

        public async Task<ActionResult<string>> Delete(Project template)
        {
            var project = await ProjectRepositoryOut.GetByIDAsync(template.ProjectId);
            if (project == null)
            {
                return JsonConvert.SerializeObject(new { success = false, data = "", message = "Project Not Found" });
            }
            await BudgetRepositoryIn.DeleteAsync(template.BudgetId);
            await TimelineRepositoryIn.DeleteAsync(template.TimelineId);
            await ProjectRepositoryIn.DeleteAsync(template);
            return JsonConvert.SerializeObject(new { success = true, data = "", message = "Project Successfully Deleted" });
        }

        public async Task<ActionResult<string>> All()
        {
            var projects = await ProjectRepositoryOut.GetAllAsync();
            var list = projects.ToList();
            for (int i = 0; i < list.Count; i++)
            {
                if (i + 1 < list.Count)
                {
                    list[i].CompareById(list[i + 1]);
                }
            }
            return JsonConvert.SerializeObject(new { success = true, data = projects, message = "Projects Successfully Retrieved" });
        }


        //------------------------------------------------------TO BE UPDATED---------------------------------------------------//
        public async Task<ActionResult<string>> GetProjectByTag(string tag)
        {
            var projectByTag = await ProjectsRepositoryOut.GetProjectByTag(tag);
            if (projectByTag == null)
            {
                return JsonConvert.SerializeObject(new { success = false, message = "Tag Not Found" }, settings);
            }
            return JsonConvert.SerializeObject(new { success = true, data = projectByTag, message = "Tag Successfully Retrieved" }, settings);
        }
        public async Task<ActionResult<string>> GetProjectInProgress()
        {
            var projectByTag = await ProjectsRepositoryOut.GetProjectInProgress();
            if (projectByTag == null)
            {
                return JsonConvert.SerializeObject(new { success = false, message = "Test Not Found" }, settings);
            }
            return JsonConvert.SerializeObject(new { success = true, data = projectByTag, message = "Test Successfully Retrieved" }, settings);
        }
        public async Task<ActionResult<string>> GetProjectPinned()
        {
            var projectByTag = await ProjectsRepositoryOut.GetProjectPinned();
            if (projectByTag == null)
            {
                return JsonConvert.SerializeObject(new { success = false, message = "Test Not Found" }, settings);
            }
            return JsonConvert.SerializeObject(new { success = true, data = projectByTag, message = "Test Successfully Retrieved" }, settings);
        }
        public async Task<ActionResult<string>> GetProjectArchived()
        {
            var projectByTag = await ProjectsRepositoryOut.GetProjectArchived();
            if (projectByTag == null)
            {
                return JsonConvert.SerializeObject(new { success = false, message = "Test Not Found" }, settings);
            }
            return JsonConvert.SerializeObject(new { success = true, data = projectByTag, message = "Test Successfully Retrieved" }, settings);
        }

        public async Task<ActionResult<string>> UpdateStatusToPinned(string id, Project template)
        {
            if (id != template.ProjectId)
            {
                return JsonConvert.SerializeObject(new { success = false, data = "", message = "Project Id Mismatch" });
            }
            await ProjectsRepositoryIn.UpdateStatusToPinned(template);
            try
            {
                return JsonConvert.SerializeObject(new { success = true, data = template, message = "Project Successfully Updated" });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Exists(id))
                {
                    return JsonConvert.SerializeObject(new { success = false, data = "", message = "Project Not Found" });
                }
                else
                {
                    throw;
                }
            }
        }

        public async Task<ActionResult<string>> UpdateStatusToArchive(string id, Project template)
        {
            if (id != template.ProjectId)
            {
                return JsonConvert.SerializeObject(new { success = false, data = "", message = "Project Id Mismatch" });
            }
            await ProjectsRepositoryIn.UpdateStatusToArchive(template);
            try
            {
                return JsonConvert.SerializeObject(new { success = true, data = template, message = "Project Successfully Updated" });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Exists(id))
                {
                    return JsonConvert.SerializeObject(new { success = false, data = "", message = "Project Not Found" });
                }
                else
                {
                    throw;
                }
            }
        }


        public async Task<ActionResult<string>> UpdateStatusToInProgress(string id, Project template)
        {
            if (id != template.ProjectId)
            {
                return JsonConvert.SerializeObject(new { success = false, data = "", message = "Project Id Mismatch" });
            }
            await ProjectsRepositoryIn.UpdateStatusToInProgress(template);
            try
            {
                return JsonConvert.SerializeObject(new { success = true, data = template, message = "Project Successfully Updated" });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Exists(id))
                {
                    return JsonConvert.SerializeObject(new { success = false, data = "", message = "Project Not Found" });
                }
                else
                {
                    throw;
                }
            }
        }

        //------------------------------------------------------TO BE UPDATED---------------------------------------------------//

        public string Settings()
        {
            Settings settings = new Settings();
            settings.ColumnSettings = new Dictionary<string, ColumnHeader>();
            settings.FieldSettings = new Dictionary<string, InputType>();

            settings.ColumnSettings.Add("ProjectId", new ColumnHeader { displayHeader = "Project Id" });
            settings.ColumnSettings.Add("ProjectName", new ColumnHeader { displayHeader = "Project Name" });
            settings.ColumnSettings.Add("ProjectDescription", new ColumnHeader { displayHeader = "Project Description" });

            // settings.ColumnSettings.Add("ProjectVolunteer", new ColumnHeader { displayHeader = "Project Volunteer" });
            settings.ColumnSettings.Add("ProjectStatus", new ColumnHeader { displayHeader = "Project Status" });
            settings.ColumnSettings.Add("ServiceCenterId", new ColumnHeader { displayHeader = "Service Center Id" });
            settings.ColumnSettings.Add("ProjectType", new ColumnHeader { displayHeader = "Project Type" });

            settings.FieldSettings.Add("ProjectId", new InputType { type = "text", displayLabel = "Project Id", editable = false, primaryKey = true });
            settings.FieldSettings.Add("ProjectName", new InputType { type = "text", displayLabel = "Project Name", editable = true, primaryKey = false });
            settings.FieldSettings.Add("ProjectDescription", new InputType { type = "text", displayLabel = "Project Description", editable = true, primaryKey = false });
            settings.FieldSettings.Add("ProjectStatus", new InputType { type = "text", displayLabel = "Project Status", editable = true, primaryKey = false });
            // settings.FieldSettings.Add("ProjectType", new InputType { type = "text", displayLabel = "Project Type", editable = true, primaryKey = false });

            var serviceCenters = ServiceCenterRepositoryOut.GetAll();
            settings.FieldSettings.Add("ServiceCenterId", new DropdownInputType
            {
                type = "dropdown",
                displayLabel = "Service Center",
                editable = true,
                primaryKey = false,
                options = serviceCenters.Select(x => new DropdownOption { value = x.ServiceCenterId, label = x.ServiceCenterName }).ToList()
            });

            return JsonConvert.SerializeObject(new { success = true, data = settings, message = "Settings Successfully Retrieved" });
        }


    }
}
