import Listr from 'listr';
import logUpdate from 'log-update';

export const TASKS = {
  SESSION_INITIALIZE: 0,
  ALLOCATING_INSTANCES: 1,
  EXECUTION_INITIALIZE: 2,
  EXECUTING: 3,
  DONE: 4
};

const getTaskPromise = () => {
  let resolver;
  const promise = new Promise(resolve => {
    resolver = resolve;
  });

  return {
    resolver,
    promise
  };
}
const tasksResolvers = {
  tasks: {
    [TASKS.SESSION_INITIALIZE]: getTaskPromise(),
    [TASKS.ALLOCATING_INSTANCES]: getTaskPromise(),
    [TASKS.EXECUTION_INITIALIZE]: getTaskPromise(),
    [TASKS.EXECUTING]: getTaskPromise(),
    [TASKS.DONE]: getTaskPromise()
  },
  resolved: false,
  resolveAll: () => {
    Object.values(tasksResolvers.tasks).forEach(task => task.resolver())
    tasksResolvers.resolved = true;
  }
}

const initialisationTasks = new Listr([
  {
    title: 'Allocating devices',
    task: () => new Listr([
      {
        title: 'Calculating the desired amount of resources',
        task: () => tasksResolvers.tasks[TASKS.SESSION_INITIALIZE].promise
      },
      {
        title: 'Connecting resources to this session',
        task: () => tasksResolvers.tasks[TASKS.ALLOCATING_INSTANCES].promise
      }
    ])
  },
  {
    title: 'Preparing Cypress tests environment',
    task: () => new  Listr([
      {
        title: 'Defined Node.js',
        task: () => tasksResolvers.tasks[TASKS.EXECUTION_INITIALIZE].promise
      },
      {
        title: 'Selecting Browser',
        task: () => tasksResolvers.tasks[TASKS.EXECUTION_INITIALIZE].promise
      }
    ])
  },
  {
    title: 'Installing project npm dependencies',
    task: () => new  Listr([
      {
        title: 'Install Cypress version from package.json',
        task: () => tasksResolvers.tasks[TASKS.EXECUTION_INITIALIZE].promise
      },
      {
        title: 'Installing other npm dependencies from package.json',
        task: () => tasksResolvers.tasks[TASKS.EXECUTION_INITIALIZE].promise
      }
    ])
  }
], {
  collapse: false
});

const tasksLogger  = {
  run: () => initialisationTasks.run(),
  endTask: (taskId) => {
    tasksResolvers.tasks[taskId].resolver();
    return new Promise(resolve => setTimeout(() => {
      resolve();
    }, 200));
  },
  endTasks: () => {
    if (tasksResolvers.resolved) {
      return Promise.resolve();
    }
    tasksResolvers.resolveAll();

    // Wait for resolved tasks to be printed
    return new Promise(resolve => setTimeout(() => {
      logUpdate.done();
      resolve();
    }, 200))
  },
  resolveAllTasks: () => {
    return tasksResolvers.resolved;
  }
};

export default tasksLogger;
