﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;

namespace Wowthing.Lib.Utilities
{
    public class JankTimer
    {
        public List<(string, long)> Points = new List<(string, long)>();

        private readonly Stopwatch _timer;

        public JankTimer()
        {
            _timer = Stopwatch.StartNew();
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
            return string.Join(" ", Points.Select(p => $"{p.Item1}={(double)p.Item2 / 1000:F3}s"));
        }
    }
}
