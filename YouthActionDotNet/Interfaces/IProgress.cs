
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace YouthActionDotNet.DAL
{
    internal interface IProgress<T> where T : class
    {
        [HttpPost("Create")]
        Task<ActionResult<string>> Create(T template);
        Task<ActionResult<string>> GenerateMontlyReport(string id, T template);
        [HttpPut("GenerateMontlyReport/{id}")]
        Task<ActionResult<string>> exportMonthlyProgressReport(string id, T template);
        [HttpPut("exportMonthlyProgressReport/{id}")]

        Task<ActionResult<string>> GenerateMontlyReportAll(string id, T template);
        [HttpPut("GenerateMontlyReportAll/{id}")]

        Task<ActionResult<string>> UpdateProgressReport(string id, T template);
        [HttpPut("UpdateProgressReport/{id}")]

        string Settings();
        bool Exists(string id);
    }
}