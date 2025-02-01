import {
	Editor,
	MarkdownView,
	Plugin,
	WorkspaceLeaf,
} from "obsidian";

interface DigitalPaperSettings {
	enabled: boolean;
}

const DEFAULT_SETTINGS: DigitalPaperSettings = {
	enabled: true,
};

// workaround for Obsidian's auto-pair feature
const AUTO_PAIRS = [`""`, `''`, "``", "`\n```", "()", "{}", "[]", "**", "__"];

let oldValue: string | undefined = undefined;

function handleTextChanges(oldValue: string, newValue: string, editor: Editor) {
	if (newValue.startsWith(oldValue)) {
		// if '()' was inserted, replace with just '(', and so on...
		if (AUTO_PAIRS.includes(newValue.substring(oldValue.length))) {
			editor.setValue(newValue.substring(0, oldValue.length + 1));
		}
	} else {
		// some of the existing text was changed
		editor.setValue(oldValue);
	}
}

export default class DigitalPaper extends Plugin {
	settings: DigitalPaperSettings;
	statusBarElm: HTMLElement;

	async onload() {
		await this.loadSettings();

		this.registerEvent(
			this.app.workspace.on(
				"editor-change",
				(editor: Editor, view: MarkdownView) => {
					console.log(editor.getValue());
					if (this.settings.enabled && oldValue !== undefined) {
						handleTextChanges(oldValue, editor.getValue(), editor);

						// keep the cursor at the end (prevents cursor jumping around)
						const endOfText = editor.offsetToPos(
							editor.getValue().length
						);
						editor.setCursor(endOfText);
					}

					oldValue = editor.getValue();
				}
			)
		);

		this.registerEvent(
			this.app.workspace.on("editor-paste", (evt: ClipboardEvent) => {
				// disable pasting as we cannot differentiate it from auto-pair behaviour
				if (this.settings.enabled) {
					evt.preventDefault();
					evt.stopPropagation();
				}
			})
		);

		this.registerEvent(
			this.app.workspace.on(
				"active-leaf-change",
				(leaf: WorkspaceLeaf) => {
					if (leaf.view.getViewType() === "markdown") {
						oldValue = leaf.view.editor.getValue();
					}
				}
			)
		);

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		this.statusBarElm = this.addStatusBarItem();
		this.displayModeOnStatusBar();

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "toggle",
			name: "Toggle digital paper mode",
			callback: () => {
				this.settings.enabled = !this.settings.enabled;
				this.displayModeOnStatusBar();
				this.saveSettings();
			},
		});
	}

	displayModeOnStatusBar() {
		if (this.settings.enabled) {
			this.statusBarElm.setText("paper");
		} else {
			this.statusBarElm.setText("");
		}
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
