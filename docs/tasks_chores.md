# Tasks and Chores

A Chore is something like a unit of work?

A Task is a collection of Chores + metadata.

## Task Processing

Tasks are processed when needed, usually via `activeViewTasks`. `MemoizedChoreData` is a
derived function so that each specific Chore is only processed once per character.

```ts
// derived from active view enabled tasks
for (const task of activeViewTasks) {
    const charTask = new CharacterTask()
    // derived from task's chore list + active view task settings
    for (const activeChore of getActiveChores(task)) {
        const charChore = MemoizedChoreData(chore, character)
        charTask.addChore(charChore)
    }
}
```

## Chore Processing

Chores are complicated.
