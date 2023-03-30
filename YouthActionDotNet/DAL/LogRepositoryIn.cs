using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using YouthActionDotNet.Data;
using YouthActionDotNet.Models;

namespace YouthActionDotNet.DAL
{

    public class LogRepositoryIn : GenericRepositoryIn<Logs> {

        public LogRepositoryIn(DbContext context) : base(context)
        {
            this.context = context;
            this.dbSet = context.Set<Logs>();
        }

        public virtual async Task<Logs> MakeLog(string logProject, string logAction, string logDescription, string logDoneByUser,string date)
        {
            Logs newLog = new Logs();
            newLog.logProject = logProject;
            newLog.logAction = logAction;
            newLog.logDescription = logDescription;
            newLog.logDoneByUser = logDoneByUser;
            newLog.logDate = date;

            var log = await dbSet.FirstOrDefaultAsync(l => l.logDoneByUser == newLog.logDoneByUser);
            if (log == null) {
                dbSet.Add(newLog);
                context.SaveChanges();
                return await dbSet.FirstOrDefaultAsync(l => l.logDoneByUser == newLog.logDoneByUser && l.logAction == newLog.logAction);
            }
            return null;

        }

    }
}