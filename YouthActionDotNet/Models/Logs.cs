using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace YouthActionDotNet.Models {
    public class Logs {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int logId { get; set; }
        public string logProject { get; set; }
        public string logAction { get; set; }
        public string logDescription { get; set; }
        public string logDoneByUser { get; set; }
        public string logDate { get; set; }

        [JsonIgnore]
        public virtual User User { get; set; }
        public String UserId { get; set; }
    }
}
