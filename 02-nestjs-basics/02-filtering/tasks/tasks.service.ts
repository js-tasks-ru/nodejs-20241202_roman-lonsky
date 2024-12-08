import {Injectable} from "@nestjs/common";
import {Paging, SortBy, ITask, TaskStatus} from "./task.types";
import {CompareByStatus, CompareByTitle, Task, TaskDto} from "./task.model";
import {getPage, defined} from "../helpers";

const DEFAULT_PAGE_LIMIT = 10;

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

  private filterByStatus(status: TaskStatus, tasks: Task[]): Task[] {
    return tasks.filter(task => task.status === status);
  }

  private filterByPaging({page, limit = DEFAULT_PAGE_LIMIT}: Paging, tasks: Task[]) {
    const [start, end] = getPage(page, limit);
    return tasks.slice(start, end);
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
        return;
      }
    }
  }

  private sortBy(sortBy: SortBy, tasks: Task[]): Task[] {
    const toSort = tasks.slice();
    let Comparator = this.getTaskComparator(sortBy);

    if (Comparator) {
      return toSort.sort((a, b) => new Comparator(a).compare(b));
    }

    return tasks;
  }

  getFilteredTasks(
    status?: TaskStatus,
    page?: number,
    limit?: number,
    sortBy?: SortBy,
  ): ITask[] {
    let result: TaskDto[] = this.tasks;

    if (defined(status)) {
      result = this.filterByStatus(status, result);
    }

    if (defined(sortBy)) {
      result = this.sortBy(sortBy, result);
    }

    if (defined(page)) {
      result = this.filterByPaging({page, limit}, result);
    }

    return result;
  }
}
