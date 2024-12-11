import {Injectable} from "@nestjs/common";
import {SortBy, ITask, TaskStatus} from "./task.types";
import {CompareByStatus, CompareByTitle} from "./task.model";
import {getPage, defined} from "../helpers";

const DEFAULT_PAGE_LIMIT = 10;

abstract class ChainHandler {
  constructor(
    protected tasks: ITask[],
    protected status?: TaskStatus,
    protected page?: number,
    protected limit?: number,
    protected sortBy?: SortBy,
  ) {}

  abstract execute(): ITask[];
}

type ChainParams = ConstructorParameters<typeof ChainHandler>;

class FilterStatusHandler extends ChainHandler {
  constructor(...params: ChainParams) {
    super(...params);
  }

  execute() {
    if (defined(this.status)) {
      return this.tasks.filter(task => task.status === this.status);
    } else {
      return this.tasks;
    }
  }
}

class SortByHandler extends ChainHandler {
  constructor(...params: ChainParams) {
    super(...params);
  }

  private getTaskComparator(sortBy: SortBy) {
    switch (sortBy) {
      case SortBy.STATUS: {
        return CompareByStatus;
      }
      case SortBy.TITLE: {
        return CompareByTitle;
      }
      default: {
        console.log('Not tasks comparator found for ' + sortBy);
        return;
      }
    }
  }

  execute() {
    if (defined(this.sortBy)) {
      const toSort = this.tasks.slice();

      let Comparator = this.getTaskComparator(this.sortBy);

      if (defined(Comparator)) {
        return toSort.sort((a, b) => new Comparator(a).compare(b));
      }

      return this.tasks;

    } else {
      return this.tasks;
    }
  }
}

class PagingHandler extends ChainHandler {
  constructor(...params: ChainParams) {
    super(...params);
  }

  execute() {
    if (defined(this.page)) {
      const [start, end] = getPage(this.page, this.limit ?? DEFAULT_PAGE_LIMIT);
      return this.tasks.slice(start, end);
    } else {
      return this.tasks;
    }
  }
}

type C<E> = { new(
    tasks: E[],
    status?: TaskStatus,
    page?: number,
    limit?: number,
    sortBy?: SortBy,
  ): {
    execute: () => E[];
  }; 
}

class Chain<E, T extends C<E>> {
  private handlers: T[] = [];

  constructor(
    protected tasks: E[],
    protected status?: TaskStatus,
    protected page?: number,
    protected limit?: number,
    protected sortBy?: SortBy,
  ) {}

  setHandler(handler: T) {
    this.handlers.push(handler);
    return this;
  }

  handle() {
    for (const Handler of this.handlers) {
      this.tasks =  new Handler(this.tasks, this.status, this.page, this.limit, this.sortBy).execute();
    }

    return this.tasks;
  }
}

@Injectable()
export class TasksService {
  private tasks: ITask[] = [
    {
      id: "1",
      title: "Task 1",
      description: "First task",
      status: TaskStatus.PENDING,
    },
    {
      id: "2",
      title: "Task 2",
      description: "Second task",
      status: TaskStatus.IN_PROGRESS,
    },
    {
      id: "3",
      title: "Task 3",
      description: "Third task",
      status: TaskStatus.COMPLETED,
    },
    {
      id: "4",
      title: "Task 4",
      description: "Fourth task",
      status: TaskStatus.PENDING,
    },
    {
      id: "5",
      title: "Task 5",
      description: "Fifth task",
      status: TaskStatus.IN_PROGRESS,
    },
  ];

  // private filterByStatus(status: TaskStatus, tasks: Task[]): Task[] {
  //   return tasks.filter(task => task.status === status);
  // }

  // private filterByPaging({page, limit = DEFAULT_PAGE_LIMIT}: Paging, tasks: Task[]) {
  //   const [start, end] = getPage(page, limit);
  //   return tasks.slice(start, end);
  // }

  // private getTaskComparator(sortBy: SortBy) {
  //   switch (sortBy) {
  //     case SortBy.STATUS: {
  //       return CompareByStatus;
  //     }
  //     case SortBy.TITLE: {
  //       return CompareByTitle;
  //     }
  //     default: {
  //       return;
  //     }
  //   }
  // }

  // private sortBy(sortBy: SortBy, tasks: Task[]): Task[] {
  //   const toSort = tasks.slice();
  //   let Comparator = this.getTaskComparator(sortBy);
  //
  //   if (Comparator !== undefined) {
  //     return toSort.sort((a, b) => new Comparator(a).compare(b));
  //   }
  //
  //   return tasks;
  // }

  getFilteredTasks(
    status?: TaskStatus,
    page?: number,
    limit?: number,
    sortBy?: SortBy,
  ): ITask[] {
    // let result: TaskDto[] = this.tasks;

    // if (defined(status)) {
    //   result = this.filterByStatus(status, result);
    // }
    //
    // if (defined(sortBy)) {
    //   result = this.sortBy(sortBy, result);
    // }
    //
    // if (defined(page)) {
    //   result = this.filterByPaging({page, limit}, result);
    // }

    const chain  = new Chain(this.tasks, status, page, limit, sortBy);

    const res = chain
      .setHandler(FilterStatusHandler)
      .setHandler(SortByHandler)
      .setHandler(PagingHandler)
      .handle();

    return res;
  }
}
