using System.Linq.Expressions;

namespace Taskify.Core.Interfaces;
public interface IJobScheduler
{
    void Enqueue(Expression<Action> methodCall);
    void Schedule(Expression<Action> methodCall, TimeSpan delay);
}