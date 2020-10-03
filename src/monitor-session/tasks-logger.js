import Listr from 'listr';
import logUpdate from 'log-update';

const SEC = 1000;
const tasksResolvers = {
  list: [],
  resolved: false,
  resolveAll: () => {
    if (!tasksResolvers.resolved) {
      tasksResolvers.list.forEach(done => done())
      tasksResolvers.resolved = true;
    }
  },
  getTimeoutResolver: (timeout) => {
    if (tasksResolvers.resolved) {
      return Promise.resolve();
    }
    return new Promise(resolve => {
      tasksResolvers.list.push(resolve);
      setTimeout(resolve, timeout)
    });
  }
}

const initialisationTasks = new Listr([
  {
    title: 'Allocating devices',
    task: () => new Listr([
      {
        title: 'Calculating the desired amount of resources',
        task: () => tasksResolvers.getTimeoutResolver(SEC*5)
      },
      {
        title: 'Connecting resources  to this session',
        task: () => tasksResolvers.getTimeoutResolver(SEC*15)
      }
    ])
  },
  {
    title: 'Preparing Cypress tests environment',
    task: () => new  Listr([
      {
        title: 'Defined Node.js',
        task: () => tasksResolvers.getTimeoutResolver(SEC*4)
      },
      {
        title: 'Selecting Browser',
        task: () => tasksResolvers.getTimeoutResolver(SEC*4)
      }
    ])
  },
  {
    title: 'Installing project npm dependencies',
    task: () => new  Listr([
      {
        title: 'Install Cypress version from package.json',
        task: () => tasksResolvers.getTimeoutResolver(SEC*30)
      },
      {
        title: 'Installing other npm dependencies from package.json',
        task: () => tasksResolvers.getTimeoutResolver(SEC*5*60)
      }
    ])
  }
], {
  collapse: false
});

const tasksLogger  = {
  run: () => initialisationTasks.run(),
  endTasks: () => {
    tasksResolvers.resolveAll();

    // Wait for resolved tasks to be printed
    return new Promise(next => setTimeout(() => {
      logUpdate.done();
      next();
    }, 200))
  }
};

export default tasksLogger;
