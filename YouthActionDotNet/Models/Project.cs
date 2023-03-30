using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using YouthActionDotNet.Models;

namespace YouthActionDotNet.Models
{

    public class Project : ICompare<Project>
    {  
        private List<IObserver> observers = new List<IObserver>();

        public Project()
        {
            this.ProjectId = Guid.NewGuid().ToString();
        }
        public string ProjectId { get; set; }

        public string ProjectName { get; set; }

        public string ProjectDescription { get; set; }

        // public string ProjectStartDate { get; set; }

        // public string ProjectEndDate { get; set; }

        // public string ProjectCompletionDate { get; set; }

        public string ProjectStatus { get; set; }

        public string ProjectViewStatus { get; set; }

        public string ProjectVolunteer { get; set; }

        // public double ProjectBudget { get; set; }

        public string ServiceCenterId { get; set; }
        public string TimelineId { get; set; }
        public string BudgetId { get; set; }
        [JsonIgnore]
        public virtual ServiceCenter ServiceCenter { get; set; }
        [JsonIgnore]
        public virtual Timeline Timeline { get; set; }
        [JsonIgnore]
        public virtual Budget Budget { get; set; }

        public int CompareById(Project y)
        {
          return this.ProjectId.CompareTo(y.ProjectId);
        } 

        public void Attach(IObserver observer) {
            observers.Add(observer);
        }

        // Remove an observer from the list
        public void Detach(IObserver observer) {
            observers.Remove(observer);
        }

        // Notify all observers of a state change
        public void Notify(Project project) {
            foreach (var observer in observers) {
            observer.Update(project);
            }
        }
    }

    public interface IObserver
    {
        void Update(Project project);
    }

    public class ConcreteObserver : YouthActionDotNet.Models.IObserver
{
  private Project projects;

  public ConcreteObserver(Project projects) {
    this.projects = projects;
    projects.Attach(this);
  }

  public void Update(Project project) {
    Console.WriteLine("Project status updated: " + project);
    // Do something in response to the state change
    Logs newLog = new Logs();
  }
}
}