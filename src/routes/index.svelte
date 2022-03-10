<script>
	import { each } from 'svelte/internal';
	export let data;
	let editText;
	let hideEdit = true;
	let showingEdit = false;
	let all = [];
	let allId = [];
	let index = 0;
	async function init() {
		if (!data.files) return;
		const dataObj = Object.entries(data.files)
			.map((arr) => ({ content: arr[1].content, num: +arr[0] }))
			?.sort((a, b) => a.num - b.num);
		all = dataObj.map(({ content }) => content);
		allId = dataObj.map(({ num }) => num);
	}
	init();

	async function saveEdit() {
		const pageNum = prompt('Enter # of page');
		const password = prompt('Enter password');
		await fetch('/addPage', {
			method: 'POST',
			body: JSON.stringify({
				content: editText,
				pageNum,
				password
			})
		});
	}
</script>

<div class="all">
	<div class="main-content" contenteditable bind:innerHTML={all[index]} />

	<div class="controls">
		<button
			on:click={(e) => {
				index = index === 0 ? all.length - 1 : index - 1;
			}}
			class="arrow arrow-left">&lt;</button
		>
		<div class="dots">
			{#each all as dot, i}
				<div
					on:click={(e) => {
						if (e.target instanceof HTMLElement) {
							index = +e.target.dataset.index;
						}
					}}
					data-index={i}
					class:dot--active={index === i}
					class="dot"
				/>
			{/each}
			<div class="dot dot--red" on:click={(e) => (hideEdit = !hideEdit)} />
		</div>
		<button
			on:click={(e) => {
				index = index === all.length - 1 ? 0 : index + 1;
			}}
			class="arrow arrow-right">&gt;</button
		>
	</div>
	<div class="edit" class:hide={hideEdit}>
		<div class="second-row">
			<div>
				{#each allId as id}
					<p>
						{id}<button
							data-id={id}
							on:click={async (e) => {
								if (e.target instanceof HTMLElement) {
									const password = prompt('Enter password');
									await fetch('/deletePage', {
										method: 'PATCH',
										body: JSON.stringify({
											pageNum: e.target.dataset.id,
											password
										})
									});
									showingEdit = false;
								}
							}}
							class="deleteButton">x</button
						>
					</p>
				{/each}
			</div>
			<textarea bind:value={editText} class="textarea" />
		</div>
		<div>
			<button
				on:click={(e) => {
					if (showingEdit) {
						all.pop();
						all = all;
					}
					all = [...all, editText];
					index = all.length - 1;
					showingEdit = true;
				}}>Preview</button
			>
			<button on:click={saveEdit}>Save</button>
		</div>
	</div>
</div>

<style>
	.all {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.main-content {
		display: flex;
		justify-content: center;
		border: none;
		margin: 0 30vw;
	}
	.main-content > :global(:first-child) {
		border: 5px solid black;
	}

	.arrow {
		/* background-color: rgb(173, 173, 173); */
		border-radius: 100px;
		border: none;
		font-size: 40px;
	}
	.controls {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 40px;
	}
	.dots {
		gap: 5px;
		display: flex;
	}
	.dot {
		border: 1px solid black;
		border-radius: 100px;
		width: 10px;
		height: 10px;
	}
	.dot--active {
		background-color: black;
	}
	.dot--red {
		border: 1px solid red;
		border-radius: 0px;

		background-color: red;
	}
	.textarea {
		width: 500px;
		height: 100%;
		resize: none;
	}
	.edit {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.hide {
		display: none;
	}
	.second-row {
		display: flex;
		gap: 20px;
		/* center vertically */
		align-items: center;
	}
	.deleteButton {
		background: transparent;
		/* border: 1px solid #f00;
		border-radius: 2em; */
		border: none;
		color: #f00;
		display: inline-block;
		font-size: 20px;
		line-height: 2px;
		margin: 0 0 8px;
		padding: 0;
		text-align: center;
		height: 15px;
		width: 15px;
	}
</style>
