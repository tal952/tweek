﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Engine.Drivers.Keys
{
    public interface IKeysDriver
    {
        event Action OnPathChanges;
        Task<List<string>> GetPaths();
    }
}