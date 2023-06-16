import { Project, ProjectStatus } from "../models/project";

type ListenerFn<T> = (item: T[]) => void;

class State<T> {
	protected listeners: ListenerFn<T>[] = [];
	addListeners(listenerFunction: ListenerFn<T>) {
		this.listeners.push(listenerFunction);
	}
}
export class ProjectState extends State<Project> {
	private projects: Project[] = [];
	private static instance: ProjectState;

	private constructor() {
		super();
	}

	static getInstance() {
		if (this.instance) return this.instance;
		else {
			this.instance = new ProjectState();
			return this.instance;
		}
	}

	addProject(title: string, description: string, persons: number) {
		const newProject = new Project(
			Math.random().toString(),
			title,
			description,
			persons,
			ProjectStatus.Active
		);
		this.projects.push(newProject);
		this.updateListeners();
	}

	moveProject(projectId: string, newStatus: ProjectStatus) {
		const project = this.projects.find((item) => item.id === projectId);

		if (project && project.status !== newStatus) {
			project.status = newStatus;
			this.updateListeners();
		}
	}

	private updateListeners() {
		for (const listener of this.listeners) {
			listener(this.projects.slice());
		}
	}
}

export const projectState = ProjectState.getInstance();
