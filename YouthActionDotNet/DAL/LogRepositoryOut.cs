using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using YouthActionDotNet.Data;
using YouthActionDotNet.Models;

namespace YouthActionDotNet.DAL
{

    public class LogRepositoryOut: GenericRepositoryOut<Logs> {

        public LogRepositoryOut(DbContext context) : base(context)
        {
            this.context = context;
            this.dbSet = context.Set<Logs>();
        }

        public async Task<List<Logs>> GetLogsByUser(string user) {
            var log = await dbSet.Where(p => p.logDoneByUser == user).ToListAsync();
            if (log == null)
            {
                return null;
            }
            return log;
        }
    }
}