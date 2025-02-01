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

let oldValue: string | undefined = undefined;

export default class DigitalPaper extends Plugin {
	settings: DigitalPaperSettings;
	statusBarElm: HTMLElement;

	async onload() {
		await this.loadSettings();

		this.registerEvent(
			this.app.workspace.on(
				"editor-change",
				(editor: Editor, view: MarkdownView) => {
					if (
						this.settings.enabled &&
						oldValue !== undefined &&
						!editor.getValue().startsWith(oldValue)
					) {
						// user changed existing text, revert to old value
						editor.setValue(oldValue);
						// keep the cursor at the end (prevents cursor jumping around)
						const endOfText = editor.offsetToPos(oldValue.length);
						editor.setCursor(endOfText);
					}
					oldValue = editor.getValue();
				}
			)
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
