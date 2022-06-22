using System.Diagnostics;

namespace Wowthing.Lib.Utilities
{
    public class JankTimer
    {
        public List<(string, long)> Points = new List<(string, long)>();

        private readonly Stopwatch _timer;

        public JankTimer()
        {
            _timer = Stopwatch.StartNew();
            AddPoint("create");
        }

        public void AddPoint(string label, bool stop = false)
        {
            _timer.Stop();
            Points.Add((label, _timer.ElapsedMilliseconds));
            if (!stop)
            {
                _timer.Restart();
            }
        }

        public override string ToString()
        {
            return string.Join(" ", Points.Skip(1).Select(p => $"{p.Item1}={(double)p.Item2 / 1000:F3}s"));
        }

        public string TotalDuration => $"{(Points.Last().Item2 - Points.First().Item2) / 1000:F3}s";
    }
}
