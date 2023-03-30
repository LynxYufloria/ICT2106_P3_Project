using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using YouthActionDotNet.Data;
using YouthActionDotNet.Models;

namespace YouthActionDotNet.DAL
{
    public class ProgressReportRepositoryOut : GenericRepositoryOut<ProgressReport>
    {   
        public ProgressReportRepositoryOut(DBContext context) : base(context)
        {
            this.context = context;
            this.dbSet = context.Set<ProgressReport>();
        }

        public async Task<List<ProgressReport>> retrieveReport(string id){
            return await dbSet.Where(p => p.reportId == id).ToListAsync();
        }


    }
}