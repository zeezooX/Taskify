using Hangfire;
using System.Linq.Expressions;
using Taskify.Core.Interfaces;

namespace Taskify.Infrastructure.Services;
public class HangfireJobScheduler : IJobScheduler
{
    public void Enqueue(Expression<Action> methodCall)
    {
        BackgroundJob.Enqueue(methodCall);
    }
    public void Schedule(Expression<Action> methodCall, TimeSpan delay)
    {
        BackgroundJob.Schedule(methodCall, delay);
    }
}