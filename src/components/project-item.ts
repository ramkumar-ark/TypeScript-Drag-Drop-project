import { Component } from "./base-component";
import { Draggable } from "../models/drag-drop";
import { Project } from "../models/project";

export class ProjectItem
	extends Component<HTMLUListElement, HTMLLIElement>
	implements Draggable
{
	private project: Project;

	get persons(): string {
		if (this.project.people === 1) return "1 Person";
		else return `${this.project.people} Persons`;
	}

	constructor(hostId: string, project: Project) {
		super("single-project", hostId, false, project.id);
		this.project = project;
		this.configure();
		this.renderContent();
	}

	renderContent(): void {
		this.element.querySelector("h2")!.innerText = this.project.title;
		this.element.querySelector("h3")!.innerText = `${this.persons} assigned`;
		this.element.querySelector("p")!.innerText = this.project.description;
	}

	configure(): void {
		this.element.addEventListener(
			"dragstart",
			this.dragStartHandler.bind(this)
		);
		this.element.addEventListener("dragend", this.dragEndHandler.bind(this));
	}

	dragStartHandler(event: DragEvent): void {
		event.dataTransfer!.setData("text/plain", this.project.id);
		event.dataTransfer!.effectAllowed = "move";
	}

	dragEndHandler(_: DragEvent): void {
		console.log("Drag ended!");
	}
}
