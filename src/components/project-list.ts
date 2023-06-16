import { Component } from "./base-component";
import { DragTarget } from "../models/drag-drop";
import { Project, ProjectStatus } from "../models/project";
import { ProjectItem } from "./project-item";
import { projectState } from "../state/project";

export class ProjectList
	extends Component<HTMLDivElement, HTMLElement>
	implements DragTarget
{
	assignedProjects: Project[] = [];

	constructor(private type: "active" | "finished") {
		super("project-list", "app", false, `${type}-projects`);
		this.configure();
		this.renderContent();
	}

	private renderProjects(): void {
		const listElement = document.getElementById(
			`${this.type}-projects-list`
		)! as HTMLUListElement;
		listElement.innerHTML = "";
		for (const project of this.assignedProjects) {
			new ProjectItem(listElement.id, project);
		}
	}

	renderContent(): void {
		this.element.querySelector("h2")!.innerText =
			this.type.toUpperCase() + " PROJECTS";
		this.element.querySelector("ul")!.id = `${this.type}-projects-list`;
	}

	configure(): void {
		this.element.addEventListener("dragover", this.dragOverHandler.bind(this));
		this.element.addEventListener(
			"dragleave",
			this.dragLeaveHandler.bind(this)
		);
		this.element.addEventListener("drop", this.dropHandler.bind(this));
		projectState.addListeners((projects: Project[]) => {
			const relevantProjects = projects.filter((project) => {
				if (this.type === "active")
					return project.status === ProjectStatus.Active;
				return project.status === ProjectStatus.Finished;
			});
			this.assignedProjects = relevantProjects;
			this.renderProjects();
		});
	}

	dragOverHandler(event: DragEvent): void {
		event.preventDefault();
		if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
			event.preventDefault();
			const listElement = this.element.querySelector("ul")!;
			listElement.classList.add("droppable");
		}
	}

	dragLeaveHandler(_: DragEvent): void {
		const listElement = this.element.querySelector("ul")!;
		listElement.classList.remove("droppable");
	}

	dropHandler(event: DragEvent): void {
		const listElement = this.element.querySelector("ul")!;
		listElement.classList.remove("droppable");
		const projectId = event.dataTransfer!.getData("text/plain");
		projectState.moveProject(
			projectId,
			this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
		);
	}
}
